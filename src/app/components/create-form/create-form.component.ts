import { Component, Input, OnInit } from '@angular/core';
import { Form } from '../../_models/form';
import { DatabaseService } from '../../_services/database.service';
import { FormGroupService } from '../../_services/form-group-service.service';
import { Router } from '@angular/router';
import { SubmittedDialogComponent } from '../submitted-dialog/submitted-dialog.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
})
export class CreateFormComponent implements OnInit {
  @Input()
  form: Form;
  formGroup;
  indices: {
    tabIndex: number;
    sectionIndex: number;
    rowIndex: number;
    columnIndex: number;
    questionIndex: number;
  } = {
    tabIndex: null,
    sectionIndex: null,
    rowIndex: null,
    columnIndex: null,
    questionIndex: null,
  };
  submitted;

  constructor(private createFormService: DatabaseService, private formGroupService: FormGroupService, private router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.formGroupService.formGroup.subscribe((formGroup) => {
      this.formGroup = formGroup;
      this.form = formGroup.value;
      this.formGroup.valueChanges.subscribe((data) => (this.form = data));
      //this.selectedIndex = this.formGroup.controls['tabs'].controls.length - 1;
    });

    if (!!this.form) {
      this.formGroupService.newFormGroup(this.form, false);
    } else {
      this.formGroupService.newFormGroup(null, false);
    }
  }

  save(form: Form) {
    //console.log(form);
    this.createFormService.newForm(form).then((doc) => {
      this.submitted = doc;
      this.createFormService.activeUser.next(this.createFormService.activeUser.getValue());
      this.router.navigate(['/home']);
    });
  }

  openTab(tabIndex: number) {
    this.indices = {
      tabIndex: tabIndex,
      sectionIndex: null,
      rowIndex: null,
      columnIndex: null,
      questionIndex: null,
    };
  }

  openSection(sectionIndex: number) {
    this.indices = {
      tabIndex: this.indices.tabIndex,
      sectionIndex: sectionIndex,
      rowIndex: null,
      columnIndex: null,
      questionIndex: null,
    };
  }

  openRow(rowIndex: number) {
    this.indices = {
      tabIndex: this.indices.tabIndex,
      sectionIndex: this.indices.sectionIndex,
      rowIndex: rowIndex,
      columnIndex: null,
      questionIndex: null,
    };
  }

  addRow() {
    this.formGroupService.addRow(this.formGroup.controls['tabs']['controls'][this.indices.tabIndex]['controls']['sections']['controls'][this.indices.sectionIndex]['controls']['rows']);
    this.indices.rowIndex = this.formGroup.controls.tabs.controls[this.indices.tabIndex].controls.sections.controls[this.indices.sectionIndex].controls.rows.controls.length - 1;
  }

  addSection() {
    this.formGroupService.addSection(this.formGroup.controls['tabs']['controls'][this.indices.tabIndex]['controls']['sections']);
    this.indices.sectionIndex = this.formGroup.controls.tabs.controls[this.indices.tabIndex].controls.sections.controls.length - 1;
    this.openSection(this.indices.sectionIndex);
  }

  addTab() {
    this.formGroupService.addTab(this.formGroup.controls['tabs']);
    this.indices.tabIndex = this.formGroup.controls.tabs.controls.length - 1;
    this.openTab(this.indices.tabIndex);
  }

  removeTab(tabIndex: number) {
    this.formGroupService.removeFAItem(this.formGroup.controls['tabs'], tabIndex);
  }

  clear() {
    this.indices = {
      tabIndex: null,
      sectionIndex: null,
      rowIndex: null,
      columnIndex: null,
      questionIndex: null,
    };
  }

  goBack() {
    if (this.isNumber(this.indices.questionIndex)) {
      this.indices.questionIndex = null;
    } else if (this.isNumber(this.indices.columnIndex)) {
      this.indices.columnIndex = null;
    } else if (this.isNumber(this.indices.rowIndex)) {
      this.indices.rowIndex = null;
    } else if (this.isNumber(this.indices.sectionIndex)) {
      this.indices.sectionIndex = null;
    } else if (this.isNumber(this.indices.tabIndex)) {
      this.indices.tabIndex = null;
    }
  }

  openMain() {
    this.clear();
  }

  isNumber(i) {
    return typeof i === 'number';
  }

  openSubmitDialog(): void {
    let dialogRef = this.dialog.open(SubmittedDialogComponent, {
      data: { submitted: this.submitted },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.formGroup = null;
      this.router.navigate(['/home']);
    });
  }

  confirmDialogue(action, actionName, message, form = null, index = null) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'save':
            this.save(form);
            break;
        }
      }
    });
  }
}
