import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';
import { FormGroupService } from '../../../_services/form-group-service.service';

@Component({
  selector: 'edit-question-array',
  templateUrl: './edit-question-array.component.html',
  styleUrls: ['./edit-question-array.component.scss']
})
export class EditQuestionArrayComponent extends EditQuestion {
  constructor(private formGroupService: FormGroupService) {
    super();
  }

  ngOnInit() {
    this.questionGroup.controls.rows.valueChanges.subscribe(val => {
      this.questionGroup.setControl(
        'input',
        this.formGroupService.buildFormArray([{ rows: val }])
      );
    });
  }

  addRow(rowsFA) {
    this.formGroupService.addRow(rowsFA);
  }
  removeRow(rowsFA, i) {
    this.formGroupService.removeFAItem(rowsFA, i);
  }
}
