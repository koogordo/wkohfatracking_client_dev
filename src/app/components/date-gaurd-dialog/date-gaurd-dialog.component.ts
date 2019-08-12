import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-date-gaurd-dialog',
  templateUrl: './date-gaurd-dialog.component.html',
  styleUrls: ['./date-gaurd-dialog.component.scss'],
})
export class DateGaurdDialogComponent implements OnInit {
  correctedDate;
  incorrectDate;
  ivdMoment;
  pvdMoment;
  vdMoment;
  today;
  constructor(public dialogRef: MatDialogRef<DateGaurdDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.correctedDate = this.data.visitDate;
    this.ivdMoment = moment(this.data.initVisitDate);
    this.pvdMoment = moment(this.data.prevVisitDate);
    this.today = moment().startOf('day');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  visitDateValidation() {
    const initVisitDate = moment(this.data.initVisitDate);
    const previousVisitDate = moment(this.data.prevVisitDate);
    // console.log(previousVisitDate.format('MM/DD/YYYY'));
    const visitDate = moment(this.correctedDate);
    if (
      (visitDate.isSameOrAfter(initVisitDate) || initVisitDate.format('MM/DD/YYYY') === 'Invalid date') &&
      (visitDate.isAfter(previousVisitDate) || previousVisitDate.format('MM/DD/YYYY') === 'Invalid date') &&
      visitDate.isSameOrBefore(moment().startOf('day'))
    ) {
      return true;
    }
    return false;
  }
}
