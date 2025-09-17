import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSuffix',
  standalone: true,
})
export class NumberSuffixPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '0';

    if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
      return value.toString();
    }
  }
}

// Another Way
// export class NumberSuffixPipe implements PipeTransform {
//   transform(value: number): string {
//     if (!value) return '';

//     if (value < 1000) return value.toString();

//     const suffixes = ['', 'K', 'M', 'B', 'T'];

//     const tier = Math.min(
//       suffixes.length - 1,
//       Math.floor(Math.log10(value) / 3)
//     );

//     const scaled = value / Math.pow(10, tier * 3);
//     return `${parseFloat(scaled.toFixed(1))}${suffixes[tier]}`;
//   }
// }
