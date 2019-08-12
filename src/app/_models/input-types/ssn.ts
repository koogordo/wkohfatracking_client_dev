import { Input } from './input';


export class Ssn extends Input<string> {
  type = 'ssn';
  placeholder: string;
  hint: string;
  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.placeholder = options['placeholder'] || '';
    this.hint = options['hint'] || '';
  }
}
