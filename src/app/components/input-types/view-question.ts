import { Input, OnInit, Injector } from '@angular/core';
import { FormGroupService } from '../../_services/form-group-service.service';
import { DatabaseService } from 'src/app/_services/database.service';
import { NamePipe } from '../../_pipes/name.pipe';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DateGaurdDialogComponent } from '../date-gaurd-dialog/date-gaurd-dialog.component';
declare var require: any;
var pouchCollate = require('pouchdb-collate');
export class ViewQuestion implements OnInit {
  @Input('group') questionGroup;
  @Input('disabled') disabled;
  @Input() disabledNotes;
  @Input() cleared;
  @Input() index;
  @Input() previewMode;
  @Input() client;
  validators = [];
  formGroup;
  dateValidation: any;
  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {}
  ngOnInit() {
    this.dateValidation = {
      valid: true,
      visitDate: '',
      initVisitDate: '',
      previousVisitDate: '',
    };
    this.validators = this.formGroupService.getQuestionOfType(this.questionGroup.value)['validators'];
    if (this.disabled) {
      this.questionGroup.controls.input.disable();
    } else {
      this.questionGroup.controls.input.enable();
    }

    if (this.cleared) {
      this.clearInput();
    }

    if (this.questionGroup.getRawValue().key === 'Client Name') {
      const namePipe = new NamePipe();
      const fg = this.formGroupService.formGroupBS.getValue();
      //this.db.getClient(pouchCollate.parseIndexableString(decodeURI(fg.getRawValue().client))).then((client) => {
      if (this.client) {
        this.questionGroup.controls.input.setValue(`${this.client.clientFName} ${this.client.clientLName}`);
      }

      this.questionGroup.controls.input.disable();
      // });
    }

    if (this.questionGroup.getRawValue().key === 'Client Number') {
      const fg = this.formGroupService.formGroupBS.getValue();
      const id = pouchCollate.parseIndexableString(decodeURI(fg.getRawValue().client));
      this.questionGroup.controls.input.setValue(`${id[0]}-${id[1]}-${id[2]}`) || '';
      this.questionGroup.controls.input.disable();
    }

    // disable username control on edit user to prevent any user from changing their username. Once a username is set at the time a user is added it cannot be changed.
    if (this.questionGroup.getRawValue().input !== '' && this.questionGroup.getRawValue().key === 'Uname') {
      this.questionGroup.controls.input.disable();
    }

    if (
      this.db
        .getActiveUser()
        .getRoles()
        .indexOf('_admin') < 0 &&
      this.questionGroup.getRawValue().input !== '' &&
      this.questionGroup.getRawValue().key === 'Role'
    ) {
      this.questionGroup.controls.input.disable();
    }
    if (!this.previewMode) {
      this.questionGroup.controls.input.valueChanges.subscribe((val) => {
        if (this.questionGroup.getRawValue().key === 'Visit Date') {
          this.dateValidation = this.visitDateValidation(val);
          if (this.dateValidation.valid) {
            this.formGroupService.updateAndStageChanges(this.questionGroup.getRawValue().key, val);
          } else if (!this.dateValidation.valid && this.dateValidation.visitDate !== '' && this.dateValidation.visitDate !== null) {
            let dialogRef = this.matDialog.open(DateGaurdDialogComponent, {
              data: { visitDate: this.dateValidation.visitDate, initVisitDate: this.dateValidation.initVisitDate, prevVisitDate: this.dateValidation.previousVisitDate },
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(() => {
              this.questionGroup.controls.input.reset();
              this.dateValidation.visitDate = '';
            });
          }
        } else {
          this.formGroupService.updateAndStageChanges(this.questionGroup.getRawValue().key, val);
        }
      });
    }
  }

  setQG() {
    this.formGroupService.setCurQuestionGroup(this.questionGroup);
    this.formGroupService.setCurIndex(this.index);
  }
  clearInput() {
    this.questionGroup.controls.input.setValue('');
  }

  visitDateValidation(newDateValue) {
    const initVisitDate = moment(this.formGroupService.getQuestionGroupInputValue('Initial Visit Date'));
    const previousVisitDate = moment(this.formGroupService.getQuestionGroupInputValue('Previous Visit Date'));
    const visitDate = moment(newDateValue);

    if (
      (visitDate.isSameOrAfter(initVisitDate) || initVisitDate.format('MM/DD/YYYY') === 'Invalid date') &&
      (visitDate.isAfter(previousVisitDate) || previousVisitDate.format('MM/DD/YYYY') === 'Invalid date') &&
      visitDate.isSameOrBefore(moment().startOf('day'))
    ) {
      return {
        valid: true,
        visitDate: newDateValue,
        initVisitDate: this.formGroupService.getQuestionGroupInputValue('Initial Visit Date'),
        previousVisitDate: this.formGroupService.getQuestionGroupInputValue('Previous Visit Date'),
      };
    } else if (visitDate.isSameOrAfter(initVisitDate) && this.formGroupService.getQuestionGroupInputValue('Previous Visit Date') === '' && visitDate.isSameOrBefore(moment().startOf('day'))) {
      return {
        valid: true,
        visitDate: newDateValue,
        initVisitDate: this.formGroupService.getQuestionGroupInputValue('Initial Visit Date'),
        previousVisitDate: this.formGroupService.getQuestionGroupInputValue('Previous Visit Date'),
      };
    }
    return {
      valid: false,
      visitDate: newDateValue,
      initVisitDate: this.formGroupService.getQuestionGroupInputValue('Initial Visit Date'),
      previousVisitDate: this.formGroupService.getQuestionGroupInputValue('Previous Visit Date'),
    };
  }
}
