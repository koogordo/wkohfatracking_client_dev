import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';
import { FormGroupService } from '../../../_services/form-group-service.service';

@Component({
  selector: 'edit-question-group',
  templateUrl: './edit-question-group.component.html',
  styleUrls: ['./edit-question-group.component.scss']
})
export class EditQuestionGroupComponent extends EditQuestion {
  constructor(private formGroupService: FormGroupService) {
    super();
  }

  ngOnInit() {}

  addRow(rowsFA) {
    this.formGroupService.addRow(rowsFA);
  }
  removeRow(rowsFA, i) {
    this.formGroupService.removeFAItem(rowsFA, i);
  }
}
