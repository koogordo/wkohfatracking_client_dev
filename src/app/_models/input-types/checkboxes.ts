import { Input } from './input';
import {Row} from "../row";


export class Checkboxes extends Input<string[]> {
  type = 'checkboxes';
  orientation: ['horizontal','vertical'];
  options: {key: string, value: string, specify:boolean, rows:Row[]}[] = [];
  specifyPosition: ['below', 'right'];
  offset: string;
  changed: boolean;

  constructor(options: {} = {}) {
    super(options);
    this.default = options['default'] || [];
    if (!options['input']){
      options['input'] = [];
    }
    this.input = (options['input'].toString() !== [].toString())?(options['input'] || []):(options['default'] || []);
    this.options = options['options'] || [{key:"",value:"", specify:false, rows:[]}];
    this.orientation = options['orientation'] || 'horizontal';
    this.specifyPosition = options['specifyPosition'] || 'right';
    this.offset = options['offset'] || 'nogrow';
    this.changed = !!options['changed'];
  }
}
