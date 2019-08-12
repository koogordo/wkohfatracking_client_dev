import { Input } from './input';

export class Signature extends Input<string> {
  type = 'signature';
  placeholder: string;
  hint: string;

  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.placeholder = options['placeholder'] || '';
    this.hint = options['hint'] || '';
  }
}
