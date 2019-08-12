import { Input } from './input';


export class DateInput extends Input<string> {
  type = 'date';
  maxDate;
  minDate;
  defaultToday;
  placeholder: string;
  hint: string;

  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.maxDate = options['maxDate'] || '';
    this.minDate = options['minDate'] || '';
    this.defaultToday = !!options['defaultToday'];
    this.placeholder = options['placeholder'] || '';
    this.hint = options['hint'] || '';
  }
}
