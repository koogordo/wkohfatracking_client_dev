import { Input } from './input';
import {Row} from "../row";


export class QuestionArray extends Input<any[]> {
  type = 'question-array';
  removable: boolean;
  rows: Row[];
  addButtonText: string;

  constructor(options: {} = {}) {
    super(options);
    this.rows = options['rows'] || [new Row()];
    this.addButtonText = options['addButtonText'] || "Add Item";
    this.input = options['input'] || [{rows:this.rows}] || [{rows: [new Row()]}];
    this.removable = !!options['removable'];

  }
}
