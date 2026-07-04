export class PersianNumberToWords {
  private static ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  private static teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  private static tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  private static hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  private static thousands = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];

  public static convert(num: number): string {
    if (num === 0) return 'صفر';
    if (num < 0) return 'منفی ' + this.convert(Math.abs(num));

    const parts: string[] = [];
    let tempNum = num;
    let unitIndex = 0;

    while (tempNum > 0) {
      const chunk = tempNum % 1000;
      if (chunk !== 0) {
        const chunkText = this.convertChunk(chunk);
        const unit = this.thousands[unitIndex];
        parts.unshift(chunkText + (unit ? ' ' + unit : ''));
      }
      tempNum = Math.floor(tempNum / 1000);
      unitIndex++;
    }

    return parts.join(' و ');
  }

  private static convertChunk(num: number): string {
    const parts: string[] = [];
    const h = Math.floor(num / 100);
    const t = Math.floor((num % 100) / 10);
    const o = num % 10;

    if (h > 0) {
      parts.push(this.hundreds[h]);
    }

    const remainder = num % 100;
    if (remainder >= 10 && remainder < 20) {
      parts.push(this.teens[remainder - 10]);
    } else {
      if (t > 0) {
        parts.push(this.tens[t]);
      }
      if (o > 0) {
        parts.push(this.ones[o]);
      }
    }

    return parts.join(' و ');
  }
}
