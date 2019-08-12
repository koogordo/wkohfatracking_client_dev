import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from '@angular/material/core';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';

//import {default as _rollupMoment} from 'moment';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-date',
  templateUrl: './edit-date.component.html',
  styleUrls: ['./edit-date.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class EditDateComponent extends EditQuestion {
  momFCMinDate;
  momFCMaxDate;
  momFCDefaultDate;
  constructor() {
    super();
  }
  ngOnInit() {
    this.momFCMinDate = new FormControl(
      moment(this.questionGroup.value.minDate)
    );

    this.momFCMaxDate = new FormControl(
      moment(this.questionGroup.value.maxDate)
    );

    this.momFCDefaultDate = new FormControl(
      moment(this.questionGroup.value.default)
    );

    this.momFCMinDate.valueChanges.subscribe(val => {
      if (!!val) {
        this.questionGroup.controls['minDate'].setValue(val.format());
      } else {
        this.questionGroup.controls['minDate'].setValue('');
      }
    });
    this.momFCMaxDate.valueChanges.subscribe(val => {
      if (!!val) {
        this.questionGroup.controls['maxDate'].setValue(val.format());
      } else {
        this.questionGroup.controls['maxDate'].setValue('');
      }
    });
    this.momFCDefaultDate.valueChanges.subscribe(val => {
      if (!!val) {
        this.questionGroup.controls['default'].setValue(val.format());
      } else {
        this.questionGroup.controls['default'].setValue('');
      }
    });
    this.questionGroup.controls['defaultToday'].valueChanges.subscribe(val => {
      this.questionGroup.controls['default'].setValue('');
      this.momFCDefaultDate.setValue('');
    });
  }
}
