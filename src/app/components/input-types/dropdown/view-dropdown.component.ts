import { Component } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { FormControl } from '@angular/forms';
import { createWiresService } from 'selenium-webdriver/firefox';
import { DatabaseService } from 'src/app/_services/database.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-dropdown',
  templateUrl: './view-dropdown.component.html',
  styleUrls: ['./view-dropdown.component.scss'],
})
export class ViewDropdownComponent extends ViewQuestion {
  input;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  getIndex(i, j) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'option', index: i });
    temp.push({ type: 'row', index: j });
    return temp;
  }

  toggleSpecifyValues(opt) {
    if (!opt.value.specify) {
      for (const option of this.questionGroup.controls.options.controls) {
        if (option.value.specify) {
          this.resetNestedInput(option);
        }
      }
    }
  }

  resetNestedInput(fg) {
    if (fg.controls.rows) {
      for (const row of fg.controls.rows.controls) {
        this.resetNestedInput(row);
      }
    } else if (fg.controls.columns) {
      for (const column of fg.controls.columns.controls) {
        this.resetNestedInput(column);
      }
    } else if (fg.controls.options) {
      for (const option of fg.controls.options.controls) {
        this.resetNestedInput(option);
      }
    } else if (fg.controls.questions) {
      for (const question of fg.controls.questions.controls) {
        if (Array.isArray(question.value.input)) {
          question.controls.input.setValue(
            question.value.input.map(() => {
              return false;
            })
          );
        } else {
          (question.controls.input as FormControl).reset();
        }
        this.resetNestedInput(question);
      }
    }
  }
}
