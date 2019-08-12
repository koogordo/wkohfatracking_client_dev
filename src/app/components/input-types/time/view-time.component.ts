import { Component, Input } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-time',
  templateUrl: './view-time.component.html',
  styleUrls: ['./view-time.component.scss'],
})
export class ViewTimeComponent extends ViewQuestion {
  @Input()
  moveup;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
