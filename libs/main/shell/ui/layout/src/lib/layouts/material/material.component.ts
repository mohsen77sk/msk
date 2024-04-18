import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'main-layout-material',
  templateUrl: './material.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [NgIf, RouterOutlet],
})
export class MainLayoutMaterialComponent {}
