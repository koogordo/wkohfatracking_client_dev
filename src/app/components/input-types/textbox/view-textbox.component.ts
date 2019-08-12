import { Component, Input } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { FormControl } from '@angular/forms';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-textbox',
  templateUrl: './view-textbox.component.html',
  styleUrls: ['./view-textbox.component.scss'],
})
export class ViewTextboxComponent extends ViewQuestion {
  @Input()
  moveup;
  newQuestionGroupValue;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }
  ngOnInit() {
    super.ngOnInit();
    // console.log(this.questionGroup)
  }
  isArray(obj) {
    return Array.isArray(obj);
  }
}
