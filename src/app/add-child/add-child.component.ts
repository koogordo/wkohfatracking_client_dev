import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../_services/database.service';
import { FormGroupService } from '../_services/form-group-service.service';
import { SubmittedDialogComponent } from '../components/submitted-dialog/submitted-dialog.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
declare var require: any;
var pouchCollate = require('pouchdb-collate');

@Component({
  selector: 'app-add-child',
  templateUrl: './add-child.component.html',
  styleUrls: ['./add-child.component.scss'],
})
export class AddChildComponent implements OnInit, OnDestroy {
  subscriptions;
  familyID;
  formGroup;
  selectedIndex: number = 0;
  submitted;
  family;
  @ViewChild('cardView')
  cardView: ElementRef;
  constructor(private router: Router, private route: ActivatedRoute, private databaseService: DatabaseService, private formGroupService: FormGroupService, public dialog: MatDialog) {}

  ngOnInit() {
    this.subscriptions = [];
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        if (params['id']) {
          this.familyID = params['id'];
          this.databaseService.getFamily(this.familyID).then((family) => {
            this.family = family;
            this.family.clientFName = this.family.primaryFName ? this.family.primaryFName : this.family.adult[0].clientFName;
            this.family.clientLName = this.family.primaryLName ? this.family.primaryLName : this.family.adult[0].clientLName;
          });
          var id = pouchCollate.toIndexableString([this.familyID, 'Add Child']);
          id = encodeURI(id);
          this.databaseService.getSubmittedForm(id).then((form) => {
            if (form['error']) {
              this.databaseService.getForm('54blankForm%004Add%20Child%00%00').then((form) => {
                form.form.formRev = form._rev;
                this.formGroup = this.formGroupService.buildFormGroup(form.form);
                this.formGroupService.newFormGroup(form.form, false);
              });
            } else {
              this.formGroup = this.formGroupService.buildFormGroup(form.form);
              this.formGroupService.newFormGroup(form.form, false);
            }
          });
        }
      })
    );
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions = [];
  }
  setMaxHeight() {
    if (!!this.cardView) {
      var cardHeight = parseFloat(window.getComputedStyle(this.cardView.nativeElement, null).height);
      return cardHeight;
    } else {
      return 0;
    }
  }
  updateClients() {
    // console.log( this.formGroup.getRawValue());
    var clientFNameIndex = this.formGroupService.indexQuestionGroup(this.formGroup.getRawValue(), 'Child FName');
    var clientLNameIndex = this.formGroupService.indexQuestionGroup(this.formGroup.getRawValue(), 'Child LName');
    var ssnIndex = this.formGroupService.indexQuestionGroup(this.formGroup.getRawValue(), 'Child SSN');
    var clientFName = this.formGroupService.findFormPartByIndex(this.formGroup.getRawValue(), clientFNameIndex);
    var clientLName = this.formGroupService.findFormPartByIndex(this.formGroup.getRawValue(), clientLNameIndex);
    var ssn = this.formGroupService.findFormPartByIndex(this.formGroup.getRawValue(), ssnIndex);

    this.databaseService.getFamily(this.familyID).then((family) => {
      const tempForm = this.formGroup.getRawValue();
      tempForm.client = encodeURI(pouchCollate.toIndexableString([this.familyID, 'child', family.child.length.toString()]));
      const tempFamily = family;
      family.child.push({
        clientFName: clientFName.input,
        clientLName: clientLName.input,
        clientID: tempForm.client,
        ssn: ssn.input,
        form: tempForm,
      });
      this.databaseService.putFamily(family).then((res) => {
        // console.log(res);
        this.router.navigate(['/home'], { queryParams: { returnFamily: this.familyID } });
      });
    });
  }
  nextTab() {
    if (this.selectedIndex < this.formGroup.value.tabs.length - 1) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  prevTab() {
    if (this.selectedIndex > 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }
  openDialog(goHome: boolean): void {
    let dialogRef = this.dialog.open(SubmittedDialogComponent, {
      data: { submitted: this.submitted },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (goHome) {
        this.formGroup = null;
      }
    });
  }

  confirmDialogue(action, actionName, message) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'updateclient':
            this.updateClients();
            break;
        }
      }
    });
  }
}
