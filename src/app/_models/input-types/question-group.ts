import {Input} from './input';
import {Row} from "../row";


export class QuestionGroup extends Input<any> {
  type = 'question-group';
  rows: Row[];

  constructor(options: {} = {}) {
    super(options);
    this.rows = options['rows'] || [];
  }
}
