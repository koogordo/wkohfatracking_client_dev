import { Input } from './input';


export class Slider extends Input<number> {
  type = 'slider';
  min:number;
  max:number;
  step:number;

  constructor(options: {}){
    super(options);
    this.min = options['min'] || 1;
    this.max = options['max'] || 5;
    this.step = options['step'] || 0.5;
    this.input = options['input'] || options['default'];
    this.default = options['default'];
  }
}
