import { Component, Input, OnInit } from '@angular/core';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { ViewNotesComponent } from '../../view-notes/view-notes.component';
import { MatDialog } from '@angular/material';
import { DatabaseService } from '../../../_services/database.service';
var pouchCollate = require('pouchdb-collate');
import * as moment from 'moment';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-view-input-type',
  templateUrl: './view-input-type.component.html',
  styleUrls: ['./view-input-type.component.scss'],
})
export class ViewInputTypeComponent implements OnInit {
  @Input('group') questionGroup;
  @Input() disabled;
  @Input() disabledNotes;
  @Input() cleared;
  @Input() index;
  @Input() moveup;
  @Input() previewMode;
  @Input() formGroupCtx;
  @Input() client;
  resolvedNotes = 'unresolved';
  constructor(private formGroupService: FormGroupService, public dialog: MatDialog, private databaseService: DatabaseService, private _fb: FormBuilder) {}
  ngOnInit() {
    this.resolvedNotes = this.checkResolvedNotes() ? 'resolved' : 'unresolved';
    this.questionGroup.valueChanges.subscribe(() => {
      this.resolvedNotes = this.checkResolvedNotes() ? 'resolved' : 'unresolved';
    });

    if (!this.questionGroup.getRawValue().usePreviousValue && this.questionGroup.getRawValue().initialLoad && this.formGroupService.prevFormGroupBS.getValue()) {
      const currentFgValue = this.formGroupService.formGroupBS.getValue().getRawValue();
      const prevFgValue = this.formGroupService.prevFormGroupBS.getValue().getRawValue();
      const questionKey = this.questionGroup.getRawValue().key;
      if (currentFgValue.formID !== '' && this.questionGroup.getRawValue().key !== '') {
        const indexOnCurrentForm = this.formGroupService.indexQuestionGroup(currentFgValue, questionKey);
        const indexOnPrevForm = this.formGroupService.indexQuestionGroup(prevFgValue, questionKey);
        let finalInput;
        let builtFinalInput;
        if (indexOnPrevForm) {
          finalInput = this.formGroupService.findFormPartByIndex(prevFgValue, indexOnPrevForm);
          builtFinalInput = this.formGroupService.buildFormGroup(finalInput);
        } else {
          finalInput = this.questionGroup.getRawValue();
          builtFinalInput = this.questionGroup;
        }

        if (this.questionGroup.getRawValue().type === 'question-array') {
          this.questionGroup.controls.input = builtFinalInput.controls.input;
          this.formGroupService.updateQuestionGroupInputControlsAndStageChanges(questionKey, builtFinalInput.controls.input);
        }
        this.questionGroup.controls.input.setValue(finalInput.input, { emitEvent: false });
        this.formGroupService.updateAndStageChanges(questionKey, finalInput.input);

        this.questionGroup.controls.initialLoad.setValue(false, { emitEvent: false });
      }
    }

    if (this.questionGroup.getRawValue().key === 'Review Group') {
      // console.log(this.questionGroup);
      this.databaseService.getReviewGroups().then((reviewGroups) => {
        const options: any[] = [];
        reviewGroups.forEach((group) => {
          const rawOption: any = {};
          rawOption.key = group._id;
          rawOption.value = group._id;
          rawOption.specify = false;
          rawOption.rows = [];
          options.push(rawOption);
        });
        const formArrayOptions = this._fb.array(options);
        // console.log(formArrayOptions);
        this.questionGroup.controls.options = formArrayOptions;
      });
    }
  }
  setQG() {
    this.formGroupService.setCurQuestionGroup(this.questionGroup);
    this.formGroupService.setCurIndex(this.index);
    //console.log(this.databaseService.getInput(this.formGroupService.formGroupBS.getValue().value,this.index));
    //console.log(this.formGroupService.formGroupBS.getValue().value);
  }
  showNotes(questionGroup) {
    if (!this.disabledNotes) {
      let dialogRef = this.dialog.open(ViewNotesComponent, {
        width: '90%',
        maxWidth: '600px',
        data: { questionGroup: questionGroup },
      });
    }
  }
  checkResolvedNotes() {
    if (!!this.questionGroup) {
      for (let note of this.questionGroup.value.notes) {
        if (!note.resolved) {
          return false;
        }
      }
      return true;
    } else {
      return true;
    }
  }

  getIndex(i) {
    var temp = [];
    temp.push({ type: 'tab', index: i });
    return temp;
  }

  // ableToUsePrevValue() {
  //   return();
  // }

  questionArrayHasValues(inputs) {
    for (const input of inputs) {
      for (const row of input.rows) {
        for (const col of row.columns) {
          for (const question of col.questions) {
            if (question.input !== '' || (question.default && question.default !== question.input)) {
              return true;
            }
            if (question.input && question.input.length > 0) {
              this.questionArrayHasValues(question.input);
            }
          }
        }
      }
    }
    return false;
  }
}
