import { Component } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-checkbox',
  templateUrl: './view-checkbox.component.html',
  styleUrls: ['./view-checkbox.component.scss'],
})
export class ViewCheckboxComponent extends ViewQuestion {
  spec: boolean;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
    this.checkSpecify();
  }

  checkSpecify() {
    for (let option of this.questionGroup.value.options) {
      if (option.key == this.questionGroup.value.input) {
        if (option.specify) {
          this.spec = true;
        } else {
          this.spec = false;
        }
      }
    }
  }

  getRows() {
    for (let option of this.questionGroup.controls.options.controls) {
      if (option.value.key == this.questionGroup.value.input) {
        return option.controls.rows.controls;
      }
    }
  }
}
