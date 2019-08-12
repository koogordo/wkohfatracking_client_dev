import { Input } from './input';
import {DateInput} from './date';
import {Textbox} from './textbox';
import {QuestionGroup} from './question-group';
import {Row} from '../row';
import {Column} from '../column';


export class ContactLog extends Input<any> {
  type = 'contact-log';
  questions: Input<any>[];

  constructor(options: {}){
    super(options);
    this.questions = options['questions'] || [];
  }
}
