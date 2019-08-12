import { Input } from './input';


export class InputMap extends Input<any> {
  type = 'input-map';
  function;
  indices;
  input;

  constructor(options: {} = {}){
    super(options);
    this.function = options['function'] || "prevValue";
    this.indices = options['indices'] || {};
    this.input = options['input'] || '';
  }
}
