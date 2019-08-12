import { Component, Input } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-number',
  templateUrl: './view-number.component.html',
  styleUrls: ['./view-number.component.scss'],
})
export class ViewNumberComponent extends ViewQuestion {
  @Input()
  moveup;
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
    if (this.questionGroup.getRawValue().key === 'Lives Alone') {
      // console.log(this.questionGroup, this.questionGroup.getRawValue());
    }
    this.updateStrategy();
  }

  updateStrategy() {
    this.questionGroup.controls.input.valueChanges.subscribe((updateValue) => {
      const currentFormGroupValue = this.formGroupService.formGroupBS.getValue().getRawValue();
      this.questionGroup.getRawValue().input = updateValue;
      if (this.formGroupService.descendAndReplaceQuestionValue(currentFormGroupValue, this.questionGroup.getRawValue(), this.index)) {
        const temp = this.formGroupService.buildFormGroup(currentFormGroupValue);
        this.formGroupService.formGroupBS.next(temp);
      } else {
        throw new Error('Update of dropdown number group failed');
      }
    });
  }
}
