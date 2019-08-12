import { Input } from './input';
import {Row} from "../row";


export class RadioButtons extends Input<string> {
  type = 'radio-buttons';
  orientation: ['horizontal','vertical'];
  options: {key: string, value: string, specify:boolean, rows:Row[], labelWidth:string}[] = [];
  specifyPosition: ['below', 'right'];
  offset:string;
  inorout:string;

  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.options = options['options'] || [{key:"",value:"", specify:false, rows:[], labelWidth:'nogrow'}];
    for (let opt in this.options) {
      if (opt === 'value') {
        if (!this.options[opt]['labelWidth']) {
          this.options[opt]['labelWidth'] = 'nogrow';
        }
      }
    }
    this.labelWidth = options['labelWidth'];
    this.orientation = options['orientation'] || 'horizontal';
    this.specifyPosition = options['specifyPosition'] || 'right';
    this.offset = options['offset'] || 'nogrow';
    this.inorout = options['inorout'] || 'in';
  }
}
