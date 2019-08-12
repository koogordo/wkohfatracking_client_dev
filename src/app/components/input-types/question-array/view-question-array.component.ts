import { Component } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { FormBuilder } from '@angular/forms';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-question-array',
  templateUrl: './view-question-array.component.html',
  styleUrls: ['./view-question-array.component.scss'],
})
export class ViewQuestionArrayComponent extends ViewQuestion {
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }
  ngOnInit() {
    super.ngOnInit();
    // console.log(this.questionGroup.getRawValue());
    // var faItems = this._fb.array([this.formGService.buildFormGroup({ rows: this.questionGroup.value.rows })]);

    // if (!this.questionGroup.value.input) {
    //   this.questionGroup.setControl('input', faItems);
    // }
  }

  addItem() {
    let templateInput = this.questionGroup.value.rows;
    templateInput = this.setNewItemQuestionKeys(templateInput);
    this.formGroupService.addQuestionArrayInputAndStageChanges(this.questionGroup.getRawValue().key, templateInput);
    const form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const index = this.formGroupService.indexQuestionGroup(form, this.questionGroup.getRawValue().key);
    this.formGroupService.updateQuestionGroupInputControlsAndStageChanges(this.questionGroup.getRawValue().key, this.questionGroup.controls.input);
  }
  setNewItemQuestionKeys(rows) {
    for (const row of rows) {
      for (const col of row.columns) {
        for (const question of col.questions) {
          const keyBody = Math.random()
            .toString(36)
            .replace('0.', '');
          question.key = this.questionGroup.value.key + '-' + keyBody;
          if (question.rows && question.rows.length > 0) {
            this.setNewItemQuestionKeys(question.rows);
          }
        }
      }
    }
    return rows;
  }
  removeItem(i) {
    // this.formGService.removeFAItem(this.questionGroup.controls.input, i);
    this.formGroupService.removeQuestionArrayInputAndStageChanges(this.questionGroup.getRawValue().key, i);
    const form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const index = this.formGroupService.indexQuestionGroup(form, this.questionGroup.getRawValue().key);
    this.questionGroup = this.formGroupService.getQuestionGroupByIndex(index);
  }

  getIndex(i, j) {
    const temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'input', index: i });
    temp.push({ type: 'row', index: j });
    // console.log(temp);
    return temp;
  }
}
