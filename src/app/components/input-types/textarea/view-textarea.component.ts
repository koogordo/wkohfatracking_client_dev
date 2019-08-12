import { Component, Input } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-textarea',
  templateUrl: './view-textarea.component.html',
  styleUrls: ['./view-textarea.component.scss'],
})
export class ViewTextareaComponent extends ViewQuestion {
  @Input()
  moveup;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
