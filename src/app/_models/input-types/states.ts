import { Input } from './input';


export class States extends Input<string> {
  type = 'states';
  placeholder: string;
  hint: string;
  input: string;

  constructor(options: {} = {}){
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.placeholder = options['placeholder'] || '';
    this.hint = options['hint'] || '';
  }
}
