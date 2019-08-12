import { Input } from './input';
import {Row} from "../row";


export class Dropdown extends Input<string> {
  type = 'dropdown';
  placeholder;
  hint;
  options: {key: string, value: string, specify:boolean, rows:Row[]}[] = [];
  specifyPosition: ['below', 'right'];
  dropdownWidth;

  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.placeholder = options['placeholder'] || "";
    this.hint = options['hint'] || "";
    this.default = options['default'] || '';
    this.options = options['options'] || [{key:"",value:"", specify:false, rows:[]}];
    this.specifyPosition = options['specifyPosition'] || '';
    this.dropdownWidth = options['dropdownWidth'] || '';
  }
}
