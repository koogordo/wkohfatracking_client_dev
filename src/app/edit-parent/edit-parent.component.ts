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
  selector: 'app-edit-parent',
  templateUrl: './edit-parent.component.html',
  styleUrls: ['./edit-parent.component.scss'],
})
export class EditParentComponent implements OnInit {
  subscriptions;
  clientID;
  familyID;
  client;
  clientFormGroup;
  selectedIndex: number = 0;
  submitted;
  @ViewChild('cardView')
  cardView: ElementRef;
  family;
  parsedClientID;
  constructor(private router: Router, private route: ActivatedRoute, private databaseService: DatabaseService, private formGroupService: FormGroupService, public dialog: MatDialog) {}

  ngOnInit() {
    this.subscriptions = [];
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        if (params['id']) {
          this.parsedClientID = pouchCollate.parseIndexableString(decodeURI(params['id']));
          this.familyID = this.parsedClientID[0];

          this.clientID = params['id'] || ' ';
          this.databaseService.getFamily(this.familyID).then((family) => {
            this.family = family;
            this.family.clientFName = this.family.primaryFName ? this.family.primaryFName : this.family.adult[0].clientFName;
            this.family.clientLName = this.family.primaryLName ? this.family.primaryLName : this.family.adult[0].clientLName;
          });
          this.databaseService.getClient(this.parsedClientID).then((client) => {
            this.client = client;
            this.clientFormGroup = this.formGroupService.buildFormGroup(client.form);
            this.formGroupService.newFormGroup(client.form, false);
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
    var clientFNameIndex = this.formGroupService.indexQuestionGroup(this.clientFormGroup.getRawValue(), 'Parent FName');
    var clientLNameIndex = this.formGroupService.indexQuestionGroup(this.clientFormGroup.getRawValue(), 'Parent LName');
    var ssnIndex = this.formGroupService.indexQuestionGroup(this.clientFormGroup.getRawValue(), 'Parent SSN');
    var clientFName = this.formGroupService.findFormPartByIndex(this.clientFormGroup.getRawValue(), clientFNameIndex);
    var clientLName = this.formGroupService.findFormPartByIndex(this.clientFormGroup.getRawValue(), clientLNameIndex);
    var ssn = this.formGroupService.findFormPartByIndex(this.clientFormGroup.getRawValue(), ssnIndex);

    this.databaseService.getFamily(this.familyID).then((family) => {
      const tempFamily = family;

      family.adult[this.parsedClientID[2]].clientFName = clientFName.input;
      family.adult[this.parsedClientID[2]].clientLName = clientLName.input;
      family.adult[this.parsedClientID[2]].ssn = ssn.input;
      family.adult[this.parsedClientID[2]].form = this.clientFormGroup.getRawValue();
      this.databaseService.putFamily(family).then((res) => {
        // console.log(res);
        this.router.navigate(['/home'], { queryParams: { returnFamily: this.familyID } });
      });
    });
  }
  nextTab() {
    if (this.selectedIndex < this.clientFormGroup.value.tabs.length - 1) {
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
        this.clientFormGroup = null;
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
