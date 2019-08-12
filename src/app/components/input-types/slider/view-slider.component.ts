import { Component } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-slider',
  templateUrl: './view-slider.component.html',
  styleUrls: ['./view-slider.component.scss'],
})
export class ViewSliderComponent extends ViewQuestion {
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  disable(event) {
    if (event.checked) {
      this.questionGroup.controls.input.disable();
    } else {
      this.questionGroup.controls.input.enable();
    }
  }
}
