import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';
import { FormGroupService } from '../../../_services/form-group-service.service';

@Component({
  selector: 'edit-slide-toggle',
  templateUrl: './edit-slide-toggle.component.html',
  styleUrls: ['./edit-slide-toggle.component.scss']
})
export class EditSlideToggleComponent extends EditQuestion {
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
