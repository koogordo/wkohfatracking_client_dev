import { Input } from './input';
import {Row} from "../row";


export class Checkbox extends Input<boolean> {
  type = 'checkbox';
  specifyPosition: ['right','bottom'];
  options: {key: boolean, value: string, specify:boolean, rows:Row[]}[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.specifyPosition = options['specifyPosition'] || 'right';
    this.options = options['options'] || [{key: false, value: 'Unchecked', specify:false, rows:[]},{key: true, value: 'Checked', specify:false, rows:[]}];
  }
}
