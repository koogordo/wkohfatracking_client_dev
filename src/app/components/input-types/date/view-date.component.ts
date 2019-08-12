import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/_services/database.service';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'view-date',
  templateUrl: './view-date.component.html',
  styleUrls: ['./view-date.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ViewDateComponent extends ViewQuestion {
  @Input()
  moveup;
  momFCDate;
  minDate;
  maxDate;
  displayDate;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();
    this.minDate = moment(this.questionGroup.value.minDate);
    this.maxDate = moment(this.questionGroup.value.maxDate);

    if (!this.questionGroup.value.input && this.questionGroup.value.defaultToday) {
      this.momFCDate = new FormControl(moment());
      this.questionGroup.controls['input'].setValue(moment());
    } else if (this.questionGroup.value.input === 'Invalid date') {
      this.momFCDate = new FormControl('');
      this.questionGroup.controls['input'].setValue('');
    } else {
      this.momFCDate = new FormControl(moment(this.questionGroup.getRawValue().input));
    }
    this.questionGroup.controls['input'].valueChanges.subscribe((val) => {
      this.momFCDate.setValue(moment(val), { emitEvent: false });
    });
    var validators = [];

    for (let i of this.validators) {
      validators.push(i.validator);
    }
    this.momFCDate.setValidators(validators);

    this.momFCDate.valueChanges.subscribe((val) => {
      if (!!val) {
        this.questionGroup.controls['input'].setValue(val.format());
      } else {
        this.questionGroup.controls['input'].setValue('');
      }
    });
    if (this.questionGroup.getRawValue().input === 'Invalid date') {
      this.questionGroup.controls.input.setValue('', { emitEvent: true });
      this.momFCDate.setValue('', { emitEvent: true });
    }
    if (this.disabled) {
      this.momFCDate.disable();
      //don't remember why this is here
      //this.clearDate();
    }

    if (this.questionGroup.getRawValue().key === 'Initial Visit Date' && this.questionGroup.getRawValue().input !== '') {
      this.momFCDate.disable();
    }
  }

  clearDate() {
    this.momFCDate.reset('');
  }
}
