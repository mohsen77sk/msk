import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush } from '@angular/service-worker';
import { firstValueFrom } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '@msk/mirza/shell/core/auth';
import { StoreService } from '@msk/mirza/shell/core/store';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { PushConfig, PushStatus, StoreNotification } from './notifications.types';

/**
 * Order notifications for the signed-in user.
 *
 * - Realtime: while the panel is open, a socket.io connection to the API (/realtime) receives
 *   the store's notifications, plays a sound and shows a clickable toast.
 * - Web Push: an opt-in per browser. The browser subscribes through the Angular service worker
 *   (VAPID); the server then pushes OS notifications even when the tab is closed.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private _http = inject(HttpClient);
  private _router = inject(Router);
  private _zone = inject(NgZone);
  private _snackBar = inject(MatSnackBar);
  private _swPush = inject(SwPush);
  private _auth = inject(AuthService);
  private _storeService = inject(StoreService);
  private _apiEndpoint = inject(MSK_APP_CONFIG).apiEndpoint;

  private _socket: Socket | null = null;
  private _socketStoreId: number | null = null;
  private _audio: AudioContext | null = null;

  /** True when this browser has a push subscription registered for the user. */
  readonly pushEnabled = signal(false);
  readonly pushBusy = signal(false);
  /** Push needs the service worker (production builds) and a browser with the Push API. */
  readonly pushSupported = computed(
    () => this._swPush.isEnabled && 'Notification' in window && 'PushManager' in window,
  );
  /** iOS only delivers Web Push to a PWA added to the home screen. */
  readonly needsInstallHint = signal(this._isIos() && !this._isStandalone());
  readonly permissionDenied = signal(false);

  // -----------------------------------------------------------------------------------------------------
  // @ Realtime
  // -----------------------------------------------------------------------------------------------------

  /** Start following the current store; call once at startup. */
  start(): void {
    this._storeService.currentStore$.subscribe((store) => this._connect(store?.id ?? null));
    // Browsers only allow audio after a user gesture; unlock it on the first one.
    const unlock = () => {
      this._getAudio()
        ?.resume()
        .catch(() => undefined);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    void this.refreshPushState();
  }

  private _connect(storeId: number | null): void {
    if (storeId === this._socketStoreId && this._socket) {
      return;
    }
    this._socket?.disconnect();
    this._socket = null;
    this._socketStoreId = storeId;
    if (!storeId) {
      return;
    }

    const socket = io(`${this._apiEndpoint}/realtime`, {
      transports: ['websocket', 'polling'],
      reconnectionDelayMax: 30000,
      // Evaluated on every (re)connect so a renewed access token is used.
      auth: (cb) => {
        const send = () => cb({ token: this._auth.accessToken, storeId });
        if (this._auth.accessToken && this._auth.needsRefresh()) {
          this._auth.refreshTokens().subscribe({ next: send, error: send });
        } else {
          send();
        }
      },
    });
    socket.on('store-notification', (n: StoreNotification) => this._zone.run(() => this._onNotification(n)));
    // Rejected (expired token / not a member): try again later; the handshake will pick up a fresh token.
    socket.on('unauthorized', () => setTimeout(() => socket.connect(), 60000));
    this._socket = socket;
  }

  private _onNotification(n: StoreNotification): void {
    this._startAlarm();
    const ref = this._snackBar.open(`${n.title} — ${n.body}`, 'باز کردن', {
      duration: 60000,
      direction: 'rtl',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'mz-order-toast',
    });
    ref.onAction().subscribe(() => void this._router.navigateByUrl(n.url));
    // Any acknowledgement (button, swipe, timeout) silences the alarm.
    ref.afterDismissed().subscribe(() => this._stopAlarm());
  }

  private _alarmTimer: ReturnType<typeof setInterval> | null = null;
  private _alarmUntil = 0;

  /** Repeats the loud alarm until the toast is acknowledged (at most one minute). */
  private _startAlarm(): void {
    this._alarmUntil = Date.now() + 60000;
    if (this._alarmTimer) {
      return;
    }
    this.playSound();
    this._alarmTimer = setInterval(() => {
      if (Date.now() > this._alarmUntil) {
        this._stopAlarm();
      } else {
        this.playSound();
      }
    }, 2500);
  }

  private _stopAlarm(): void {
    if (this._alarmTimer) {
      clearInterval(this._alarmTimer);
      this._alarmTimer = null;
    }
  }

  /** Loud, attention-grabbing alarm generated with Web Audio (no audio file to ship). */
  playSound(): void {
    const ctx = this._getAudio();
    if (!ctx || ctx.state !== 'running') {
      return;
    }
    const start = ctx.currentTime;
    // Rising two-tone siren, three times; square waves cut through café noise.
    [0, 0.6, 1.2].forEach((t) => {
      [
        { f: 988, d: 0 },
        { f: 1319, d: 0.25 },
      ].forEach(({ f, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = f;
        const at = start + t + d;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.9, at + 0.01);
        gain.gain.setValueAtTime(0.9, at + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.24);
        osc.connect(gain).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + 0.25);
      });
    });
  }

  private _getAudio(): AudioContext | null {
    if (!this._audio) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        return null;
      }
      this._audio = new Ctor();
    }
    return this._audio;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Web Push
  // -----------------------------------------------------------------------------------------------------

  /** Reads this browser's subscription and asks the server whether it is registered. */
  async refreshPushState(): Promise<void> {
    this.permissionDenied.set('Notification' in window && Notification.permission === 'denied');
    if (!this.pushSupported()) {
      this.pushEnabled.set(false);
      return;
    }
    try {
      const sub = await firstValueFrom(this._swPush.subscription);
      if (!sub) {
        this.pushEnabled.set(false);
        return;
      }
      const status = await firstValueFrom(
        this._http.get<PushStatus>(`${this._apiEndpoint}/push/subscription`, { params: { endpoint: sub.endpoint } }),
      );
      this.pushEnabled.set(status.subscribed);
    } catch {
      this.pushEnabled.set(false);
    }
  }

  /** Ask for permission, subscribe this browser and register it on the server. */
  async enablePush(): Promise<boolean> {
    this.pushBusy.set(true);
    try {
      const config = await firstValueFrom(this._http.get<PushConfig>(`${this._apiEndpoint}/push/config`));
      if (!config.enabled || !config.publicKey) {
        return false;
      }
      const sub = await this._swPush.requestSubscription({ serverPublicKey: config.publicKey });
      await firstValueFrom(this._http.post(`${this._apiEndpoint}/push/subscriptions`, sub.toJSON()));
      this.pushEnabled.set(true);
      return true;
    } catch {
      return false;
    } finally {
      this.permissionDenied.set('Notification' in window && Notification.permission === 'denied');
      this.pushBusy.set(false);
    }
  }

  async disablePush(): Promise<void> {
    this.pushBusy.set(true);
    try {
      const sub = await firstValueFrom(this._swPush.subscription);
      if (sub) {
        await firstValueFrom(
          this._http.delete(`${this._apiEndpoint}/push/subscriptions`, { body: { endpoint: sub.endpoint } }),
        ).catch(() => undefined);
        await this._swPush.unsubscribe();
      }
      this.pushEnabled.set(false);
    } finally {
      this.pushBusy.set(false);
    }
  }

  /** Sends a test notification to this user's registered devices. */
  sendTest(): Promise<unknown> {
    return firstValueFrom(this._http.post(`${this._apiEndpoint}/push/test`, {}));
  }

  private _isIos(): boolean {
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1);
  }

  private _isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    );
  }
}
