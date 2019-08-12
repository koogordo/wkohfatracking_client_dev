import { Input } from './input';


export class Textarea extends Input<string> {
  type = 'textarea';
  placeholder: string;
  hint: string;

  constructor(options: {} = {}){
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.placeholder = options['placeholder'] || '';
    this.hint = options['hint'] || '';

  }
}
