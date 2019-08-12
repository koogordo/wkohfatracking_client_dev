import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../_services/database.service';
import { FormGroupService } from '../_services/form-group-service.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SubmittedDialogComponent } from '../components/submitted-dialog/submitted-dialog.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
declare var require: any;
var pouchCollate = require('pouchdb-collate');

@Component({
  selector: 'app-contact-log',
  templateUrl: './contact-log.component.html',
  styleUrls: ['./contact-log.component.scss'],
})
export class ContactLogComponent implements OnInit, OnDestroy {
  familyID;
  formGroup;
  submitted;
  selectedIndex: number = 0;
  @ViewChild('cardView') cardView: ElementRef;
  subscriptions = [];
  family;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private databaseService: DatabaseService,
    private formGroupService: FormGroupService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        if (params['id']) {
          this.familyID = params['id'];
          this.databaseService.getFamily(this.familyID).then((family) => {
            this.family = family;
            this.family.clientFName = this.family.primaryFName ? this.family.primaryFName : this.family.adult[0].clientFName;
            this.family.clientLName = this.family.primaryLName ? this.family.primaryLName : this.family.adult[0].clientLName;
          });
        }
        var id = pouchCollate.toIndexableString([this.familyID, 'Contact Methods']);
        id = encodeURI(id);
        this.databaseService.getSubmittedForm(id).then((form) => {
          if (form['error']) {
            this.databaseService.getForm('54blankForm%004Contact%20Methods%00%00').then((form) => {
              form.form.formRev = form._rev;
              this.formGroupService.newFormGroup(form.form, false);
            });
          } else {
            this.formGroupService.newFormGroup(form.form, false);
          }
        });
      })
    );
    this.subscriptions.push(
      this.formGroupService.formGroup.subscribe((formGroup) => {
        this.formGroup = formGroup;
      })
    );
  }
  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
  updateLog() {
    this.databaseService.saveContactLog(this.formGroup.getRawValue(), this.familyID).then((doc) => {
      this.router.navigate(['/home'], { queryParams: { returnFamily: this.familyID } });
    });
  }
  setMaxHeight() {
    if (!!this.cardView) {
      var cardHeight = parseFloat(window.getComputedStyle(this.cardView.nativeElement, null).height);
      return cardHeight;
    } else {
      return 0;
    }
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
        this.router.navigate(['/home']);
      }
    });
  }

  confirmDialogue(action, actionName, message, dismassMsg, successMsg) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'update':
            this.updateLog();
            break;
        }
        this.snackBar.open(successMsg, 'Close', { duration: 2000 });
      } else {
        this.snackBar.open(dismassMsg, 'Close', { duration: 2000 });
      }
    });
  }
  /*this.subscriptions.push(this.formGroupService.formGroup.subscribe(
            formGroup => {
              this.formGroup = formGroup;
              this.setClient();
              this.checkUnresolvedNotes();
              this.formGroup.valueChanges.subscribe(()=>{
                this.checkUnresolvedNotes();
              });
            }
          ));

        else{
          this.databaseService.getSubmittedForm(this.formID)
            .then(form => {
              this.form = form.form;
              this.formRev = form._rev;
              this.formGroupService.newFormGroup(this.form);
            });

          this.subscriptions.push(this.formGroupService.formGroup.subscribe(
            formGroup => {
              this.formGroup = formGroup;
              this.checkUnresolvedNotes();
              this.formGroup.valueChanges.subscribe(()=>{
                this.checkUnresolvedNotes();
              });
            }
          ));
        }

        this.formGroupService.newFormGroup(this.form);
      }

    })
  }*/
}
