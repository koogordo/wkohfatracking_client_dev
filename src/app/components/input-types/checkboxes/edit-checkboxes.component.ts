import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'edit-checkboxes',
  templateUrl: './edit-checkboxes.component.html',
  styleUrls: ['./edit-checkboxes.component.scss']
})
export class EditCheckboxesComponent extends EditQuestion {
  options;
  constructor(
    private formGroupService: FormGroupService
  ) {
    super();
  }

  ngOnInit() {
    this.options = this.questionGroup.value.options;
    this.maintainDefault();
  }

  addOption() {
    this.formGroupService.addSpecifyOption(
      this.questionGroup['controls']['options']
    );
  }

  addRow(rowsFA) {
    this.formGroupService.addRow(rowsFA);
  }
  removeRow(rowsFA, i) {
    this.formGroupService.removeFAItem(rowsFA, i);
  }

  removeOption(i) {
    this.formGroupService.removeFAItem(
      this.questionGroup['controls']['options'],
      i
    );
  }
  guidGenerator() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  }

  maintainDefault() {
    do {
      var val = this.questionGroup.value;
      var temp = [];
      for (let opt of val.options) {
        temp.push(new FormControl(false));
      }
      var tempFA = new FormArray(temp);
      if (
        tempFA.value.toString() !== this.questionGroup.value.default.toString()
      ) {
        this.questionGroup.setControl('default', tempFA);
      }
    } while (false);
    this.questionGroup.valueChanges.subscribe(val => {
      var temp = [];
      for (let opt of val.options) {
        temp.push(new FormControl(false));
      }
      var tempFA = new FormArray(temp);
      if (
        tempFA.value.toString() !== this.questionGroup.value.default.toString()
      ) {
        this.questionGroup.setControl('default', tempFA);
      }
    });
  }
}
