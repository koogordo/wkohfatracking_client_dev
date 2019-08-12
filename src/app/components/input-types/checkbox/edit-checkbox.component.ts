import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';
import { FormGroupService } from '../../../_services/form-group-service.service';

@Component({
  selector: 'edit-checkbox',
  templateUrl: './edit-checkbox.component.html',
  styleUrls: ['./edit-checkbox.component.scss']
})
export class EditCheckboxComponent extends EditQuestion {
  constructor(private formGroupService: FormGroupService) {
    super();
  }

  ngOnInit() {}

  addRow(option) {
    this.formGroupService.addRow(
      this.questionGroup.controls.options.controls[option].controls.rows
    );
  }

  removeRow(option, row) {
    this.formGroupService.removeFAItem(
      this.questionGroup.controls.options.controls[option].controls.rows,
      row
    );
  }
}
