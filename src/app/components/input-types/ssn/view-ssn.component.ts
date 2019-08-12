import { Component, Input } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-ssn',
  templateUrl: './view-ssn.component.html',
  styleUrls: ['./view-ssn.component.scss'],
})
export class ViewSsnComponent extends ViewQuestion {
  @Input()
  moveup;
  mask: any[] = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
