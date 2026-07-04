export class EnglishNumberToWords {
  private static ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  private static teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];
  private static tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  private static thousands = ['', 'thousand', 'million', 'billion', 'trillion'];

  public static convert(num: number): string {
    if (num === 0) return 'zero';
    if (num < 0) return 'minus ' + this.convert(Math.abs(num));

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

    return parts.join(', ');
  }

  private static convertChunk(num: number): string {
    let result = '';
    const h = Math.floor(num / 100);
    const remainder = num % 100;

    if (h > 0) {
      result += this.ones[h] + ' hundred';
      if (remainder > 0) {
        result += ' and ';
      }
    }

    if (remainder > 0) {
      if (remainder >= 10 && remainder < 20) {
        result += this.teens[remainder - 10];
      } else {
        const t = Math.floor(remainder / 10);
        const o = remainder % 10;
        if (t > 0) {
          result += this.tens[t];
          if (o > 0) {
            result += '-' + this.ones[o]; // مثل twenty-five
          }
        } else {
          result += this.ones[o];
        }
      }
    }

    return result;
  }
}
