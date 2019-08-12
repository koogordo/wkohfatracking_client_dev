import {Input} from './input';
import {Row} from "../row";


export class SlideToggle extends Input<boolean> {
  type = 'slide-toggle';
  specifyPosition: ['right','bottom'];
  options: {key: boolean, value: string, specify:boolean, rows:Row[]}[] = [];
  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.options = options['options'] || [{key: false, value: 'Off', specify:false, rows:[]},{key: true, value: 'On', specify:false, rows:[]}];
    this.specifyPosition = options['specifyPosition'] || 'right';
  }
}
