import { Component, Input } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-tel',
  templateUrl: './view-tel.component.html',
  styleUrls: ['./view-tel.component.scss'],
})
export class ViewTelComponent extends ViewQuestion {
  @Input()
  moveup;
  mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
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
  }

  updateStrategy() {
    this.questionGroup.controls.input.valueChanges.subscribe((val) => {
      const currentFormGroupValue = this.formGroupService.formGroupBS.getValue().getRawValue();
      this.questionGroup.value.input = val;
      if (this.formGroupService.descendAndReplaceQuestionValue(currentFormGroupValue, this.questionGroup.getRawValue(), this.index)) {
        // console.log('Question replaced successfully',this.questionGroup.getRawValue(), currentFormGroupValue);
        const temp = this.formGroupService.buildFormGroup(currentFormGroupValue);
        this.formGroupService.formGroupBS.next(temp);
      } else {
        throw new Error('Update of question group failed');
      }
    });
  }
}
