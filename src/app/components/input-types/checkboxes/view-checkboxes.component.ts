import { Component } from '@angular/core';
import { ViewQuestion } from '../view-question';

import { FormArray, FormControl } from '@angular/forms';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-checkboxes',
  templateUrl: './view-checkboxes.component.html',
  styleUrls: ['./view-checkboxes.component.scss'],
})
export class ViewCheckboxesComponent extends ViewQuestion {
  optionsFA;
  test = true;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }
  ngOnInit() {
    this.validators = this.formGroupService.getQuestionOfType(this.questionGroup.value)['validators'];
    if (this.disabled) {
      this.questionGroup.controls.input.disable();
    } else {
      this.questionGroup.controls.input.enable();
    }
    if (this.cleared) {
      this.clearInput();
    }
    var FCs = [];
    for (let opt in this.questionGroup.value.options) {
      if (!!this.questionGroup.getRawValue().input) {
        if (typeof this.questionGroup.getRawValue().input[opt] !== 'undefined') {
          FCs.push(
            new FormControl({
              value: this.questionGroup.getRawValue().input[opt],
              disabled: this.disabled,
            })
          );
        } else {
          FCs.push(new FormControl({ value: false, disabled: this.disabled }));
        }
      }
    }
    this.optionsFA = new FormArray(FCs);
    this.updateStrategy();

    // ANCHOR commented this subscription out, if there are problems with input values updating uncomment this section to see if it fixes it.
    // this.questionGroup.controls.input.valueChanges.subscribe(val => {
    //   this.questionGroup.controls.changed.setValue(true);
    //   this.optionsFA.setValue(val, { emitEvent: false });
    //   this.questionGroup.value.input = val;
    //   this.formGroupService.descendAndReplaceQuestionValue(this.formGroupService.formGroupBS.getValue().getRawValue(), this.questionGroup.getRawValue(), this.index);
    //   console.log(this.questionGroup.getRawValue());
    //   console.log(this.formGroupService.formGroupBS.getValue().getRawValue());
    // });
  }

  updateStrategy() {
    this.optionsFA.valueChanges.subscribe((val) => {
      const currentFormGroupValue = this.formGroupService.formGroupBS.getValue().getRawValue();
      if (!this.disabled) {
        this.questionGroup.controls['input'].setValue(val);
        this.questionGroup.controls.changed.setValue(true);
        this.questionGroup.value.input = val;
        this.questionGroup.value.options = this.optionsFA.getRawValue();
        if (this.formGroupService.descendAndReplaceQuestionValue(currentFormGroupValue, this.questionGroup.getRawValue(), this.index)) {
          const updateFormGroup = this.formGroupService.buildFormGroup(currentFormGroupValue);
          this.formGroupService.formGroupBS.next(updateFormGroup);
        } else {
          throw new Error('Question Failed To Update');
        }
      }
    });
  }
  getIndex(i, j) {
    const temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'option', index: i });
    temp.push({ type: 'row', index: j });
    return temp;
  }
  clearInput() {
    const temp = [];
    for (const option in this.questionGroup.value.options) {
      temp.push(false);
    }
    this.questionGroup.controls.input.setValue(temp);
  }
}
