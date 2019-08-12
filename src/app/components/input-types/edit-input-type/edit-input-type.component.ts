import { Component, Input, OnInit } from '@angular/core';
import { GetInputTypesService } from '../../../_services/get-input-types.service';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { QuestionArray } from '../../../_models/input-types';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-input-type',
  templateUrl: './edit-input-type.component.html',
  styleUrls: ['./edit-input-type.component.scss'],
})
export class EditInputTypeComponent implements OnInit {
  @Input('group') questionGroup: FormGroup;
  @Input() columnGroup;
  @Input() questionIndex;
  types;
  constructor(private inputTypesService: GetInputTypesService, private formGroupService: FormGroupService) {
    this.types = inputTypesService.getInputTypes();
  }

  ngOnInit() {
    /*this.questionGroup.controls.type.valueChanges.subscribe( val => {
      // console.log(this.questionGroup.value,this.columnGroup.value);
      this.selectType();

    });*/
    // console.log(this.questionGroup);
  }
  selectType() {
    //console.log(this.columnGroup['controls']['questions'].value,this.questionIndex)
    this.formGroupService.updateQuestionType(this.columnGroup['controls']['questions'], this.questionIndex);
  }
  selectPosition() {
    if (this.questionGroup.value.labelPosition === 'top' || this.questionGroup.value.labelPosition === 'bottom') {
      this.questionGroup.controls.labelWidth.setValue('');
      this.questionGroup.controls.labelWidth.disable();
    } else {
      this.questionGroup.controls.labelWidth.enable();
    }
  }
}
