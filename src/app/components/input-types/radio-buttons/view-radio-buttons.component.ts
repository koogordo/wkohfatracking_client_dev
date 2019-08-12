import { Component } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'view-radio-buttons',
  templateUrl: './view-radio-buttons.component.html',
  styleUrls: ['./view-radio-buttons.component.scss'],
})
export class ViewRadioButtonsComponent extends ViewQuestion {
  specifyPreviouslySelected;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getIndex(i, j) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'option', index: i });
    temp.push({ type: 'row', index: j });
    return temp;
  }

  showSpecifyInput(questionGroup, option) {
    const showSpecify = option.getRawValue().specify && questionGroup.getRawValue().input === option.getRawValue().key;
    return showSpecify;
  }

  clearSelected() {
    this.questionGroup.controls.input.setValue('');
    this.formGroupService.updateAndStageChanges(this.questionGroup.getRawValue().key, '');
  }

  checkIfSpecifyOptionSelected() {
    for (const opt of this.questionGroup.controls.options.controls) {
      if (opt.getRawValue().specify) {
      }
    }
  }

  toggleSpecifyValues(opt) {
    if (!opt.getRawValue().specify) {
      for (const option of this.questionGroup.controls.options.controls) {
        if (option.getRawValue().specify) {
          console.log(option);
          this.resetNestedInput(option);
        }
      }
    }
  }

  resetNestedInput(fg) {
    if (fg.controls.rows) {
      for (const row of fg.controls.rows.controls) {
        this.resetNestedInput(row);
      }
    } else if (fg.controls.columns) {
      for (const column of fg.controls.columns.controls) {
        this.resetNestedInput(column);
      }
    } else if (fg.controls.options) {
      for (const option of fg.controls.options.controls) {
        this.resetNestedInput(option);
      }
    } else if (fg.controls.questions) {
      for (const question of fg.controls.questions.controls) {
        if (question.value.type === 'checkboxes') {
          question.controls.input.setValue(question.value.default, { emitEvent: false });
        } else {
          (question.controls.input as FormControl).reset();
        }
        this.resetNestedInput(question);
      }
    }
  }
}
