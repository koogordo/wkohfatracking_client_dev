import { Component } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from '../../../_services/database.service';
import { Textbox } from '../../../_models/input-types/textbox';
import { QuestionGroup } from '../../../_models/input-types/question-group';
import { DateInput } from '../../../_models/input-types/date';
import { Column } from '../../../_models/column';
import { Row } from '../../../_models/row';
import { Textarea } from '../../../_models/input-types';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-contact-log',
  templateUrl: './view-contact-log.component.html',
  styleUrls: ['./view-contact-log.component.scss'],
})
export class ViewContactLogComponent extends ViewQuestion {
  notesQG;
  dateQG;

  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getNotesQG(index) {
    return this.questionGroup.controls.questions.controls[index].controls.rows.controls[0].controls.columns.controls[0].controls.questions.controls[0];
  }
  getDateQG(index) {
    return this.questionGroup.controls.questions.controls[index].controls.rows.controls[0].controls.columns.controls[0].controls.questions.controls[1];
  }
  setUsername(index) {
    this.questionGroup.controls.questions.controls[index].controls.rows.controls[0].controls.columns.controls[0].controls.questions.controls[2].controls.input.setValue(
      this.db.activeUser.getValue().getName()
    );
  }
  addContactNote() {
    this.formGroupService.addQuestion(
      this.questionGroup.controls.questions,
      new QuestionGroup({
        rows: [
          new Row({
            columns: [
              new Column({
                questions: [new Textarea({ placeholder: 'Notes' }), new DateInput({ placeholder: 'Date of Contact' }), new Textbox({})],
              }),
            ],
          }),
        ],
      })
    );
    //this.setUsername(this.questionGroup.value.questions.length - 1);
  }

  removeContactNote(i) {
    this.formGroupService.removeFAItem(this.questionGroup.controls.questions, i);
  }
  getNotesIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'question', index: i });
    temp.push({ type: 'row', index: 0 });
    temp.push({ type: 'column', index: 0 });
    temp.push({ type: 'question', index: 0 });
    return temp;
  }
  getDateIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'question', index: i });
    temp.push({ type: 'row', index: 0 });
    temp.push({ type: 'column', index: 0 });
    temp.push({ type: 'question', index: 1 });
    return temp;
  }
  getUserNameIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'question', index: i });
    temp.push({ type: 'row', index: 0 });
    temp.push({ type: 'column', index: 0 });
    temp.push({ type: 'question', index: 2 });
    return temp;
  }
  getUserName(i) {
    return this.questionGroup.value.questions[i].rows[0].columns[0].questions[2].input;
  }
  submitNote(i) {
    this.setUsername(i);
    this.getDateQG(i).controls.input.disable();
    this.getNotesQG(i).controls.input.disable();
  }
}
