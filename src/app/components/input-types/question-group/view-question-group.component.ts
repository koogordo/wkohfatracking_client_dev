import { Component, Input as Prop } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { FormGroup } from '@angular/forms';
import { Input } from 'src/app/_models/input-types';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-question-group',
  templateUrl: './view-question-group.component.html',
  styleUrls: ['./view-question-group.component.scss'],
})
export class ViewQuestionGroupComponent extends ViewQuestion {
  subFormGroup: FormGroup;
  @Prop() previewMode: boolean;
  @Prop() formGroupCtx;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
    this.subFormGroup = this.questionGroup.controls.rows.controls[0];
  }

  getIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'row', index: i });
    return temp;
  }
}
