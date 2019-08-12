import { Input } from './input';


export class Tel extends Input<string> {
  type = 'tel';
  placeholder: string;
  hint: string;
  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || '';
    this.placeholder = options['placeholder'] || '';
    this.hint = options['hint'] || '';
  }
}
