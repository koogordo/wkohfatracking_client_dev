import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';
import { FormGroupService } from '../../../_services/form-group-service.service';


@Component({
  selector: 'edit-radio-buttons',
  templateUrl: './edit-radio-buttons.component.html',
  styleUrls: ['./edit-radio-buttons.component.scss']
})
export class EditRadioButtonsComponent extends EditQuestion {
  options;
  constructor(
    private formGroupService: FormGroupService
  ) {
    super();
  }

  ngOnInit() {
    this.options = this.questionGroup.value.options;
  }

  addOption() {
    this.formGroupService.addSpecifyOption(
      this.questionGroup['controls']['options']
    );
  }
  removeOption(i) {
    this.formGroupService.removeFAItem(
      this.questionGroup['controls']['options'],
      i
    );
  }
  addRow(rowsFA) {
    this.formGroupService.addRow(rowsFA);
  }
  removeRow(rowsFA, i) {
    this.formGroupService.removeFAItem(rowsFA, i);
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
}
