import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroupService } from '../_services/form-group-service.service';
import { DatabaseService } from '../_services/database.service';
import { SubmittedDialogComponent } from '../components/submitted-dialog/submitted-dialog.component';
import { Form } from '../_models/form';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
import * as moment from 'moment';
declare var require: any;
var pouchCollate = require('pouchdb-collate');
import * as $PouchDB from 'pouchdb';
import { query } from '@angular/core/src/render3';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { combineLatest } from 'rxjs';
const PouchDB = $PouchDB['default'];

@Component({
  selector: 'app-admin-view-form',
  templateUrl: './admin-view-form.component.html',
  styleUrls: ['./admin-view-form.component.scss'],
})
export class AdminViewFormComponent implements OnInit, OnDestroy {
  @Input()
  form: Form;
  @Input()
  disabled;
  @Input()
  cleared;
  @ViewChild('cardView')
  cardViewRef: ElementRef;
  formGroup;
  submitted;
  selectedIndex: number = 0;
  curQuestionGroup;
  formID;
  formRev;
  selIndex;
  clientID;
  client;
  allowedClients;
  subscriptions = [];
  curStatus;
  curOS;
  returnFamily: string;
  routeParams$;
  visitedClient;
  templateForm;
  constructor(
    private databaseService: DatabaseService,
    private formGroupService: FormGroupService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.routeParams$ = combineLatest(this.route.params, this.route.queryParams);
    this.routeParams$.subscribe(([params, queryParams]) => {
      console.log(queryParams);
      if (queryParams['OS']) {
        this.curOS = queryParams['OS'];
        if (params['id']) {
          this.databaseService.getForms().then((forms) => {
            this.formID = params['id'];
            if (!queryParams['permanentView']) {
              const os = this.databaseService.getSubmittedForm(this.formID, this.curOS.toLowerCase()).then((form) => {
                this.templateForm = forms.filter((f) => {
                  return f.form.name === form.form.name;
                })[0];
                this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
                this.formRev = form._rev;
                this.clientID = this.form.client || ' ';
                this.setClient();
                this.formGroupService.newFormGroup(this.form, false);
              });
            } else {
              this.databaseService.getArchivedForm(this.formID).then((formDoc) => {
                this.templateForm = forms.filter((f) => {
                  return f.form.name === formDoc.form.name;
                })[0];
                this.form = this.isCompressed(formDoc.form) ? this.formGroupService.expand(this.templateForm.form, formDoc.form) : formDoc.form;
                this.formRev = formDoc._rev;
                this.clientID = this.form.client || ' ';
                this.setClient();
                this.formGroupService.newFormGroup(this.form, false);
              });
            }
          });

          this.subscriptions.push(
            this.formGroupService.formGroup.subscribe((formGroup) => {
              this.formGroup = formGroup;
              // console.log(this.formGroup);
              this.curStatus = formGroup.value.status[formGroup.value.status.length - 1]['value'];
              // console.log(this.curStatus);
            })
          );
        }
      } else {
        if (queryParams['permenantView']) {
          this.databaseService.getArchivedForm(this.formID).then((formDoc) => {
            this.form = formDoc.form;
            this.formRev = formDoc._rev;
            this.clientID = this.form.client || ' ';
            this.setClient();
            this.formGroupService.newFormGroup(this.form, false);
          });
        } else {
          if (queryParams['visitClientID']) {
            const splitID = queryParams['visitClientID'].split('-');
            const id = encodeURI(pouchCollate.toIndexableString([...splitID]));
            this.databaseService.getAllClientVisitsIgnoreType(id).then((formDocs) => {
              const formDoc = formDocs.filter((doc) => {
                return doc._id === params['id'];
              })[0];
              this.form = this.isCompressed(formDoc.form) ? this.formGroupService.expand(this.templateForm.form, formDoc.form) : formDoc.form;
              this.formRev = formDoc._rev;
              this.clientID = this.form.client || ' ';
              this.setClient();
              this.formGroupService.newFormGroup(this.form, false);
            });
          }
        }
        this.subscriptions.push(
          this.formGroupService.formGroup.subscribe((formGroup) => {
            this.formGroup = formGroup;
            // console.log(this.formGroup);
            this.curStatus = formGroup.value.status[formGroup.value.status.length - 1]['value'];
            // console.log(this.curStatus);
          })
        );
      }
    });
  }
  initForms() {}
  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  getStatusVal(status): number {
    var statuses = {
      open: 0,
      'action required': 1,
      permanent: 4,
      queued: 3,
      'reviewer pool': 2,
      'under review': 2,
      submitted: 1,
    };
    return statuses[status];
  }

  saveToPool() {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    form = this.formGroupService.compress(form);
    form.status.push({
      value: 'reviewer pool',
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: '',
      username: this.databaseService.activeUser.getValue().getName(),
    });
    var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    if (id[3] !== form.tabs[0].sections[0].rows[0].columns[1].questions[0].input) {
      this.databaseService.deleteForm(this.formID).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.saveForm(form).then((doc) => {
          this.submitted = doc;
          this.formID = doc.id;
          //this.openDialog(false);
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = form.form;
            // console.log(this.form);
            this.formRev = form._rev;
            // this.formGroupService.newFormGroup(this.form, false);
            this.router.navigate(['/home']);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        this.openDialog(false);
        // console.log(this.submitted);
        this.databaseService
          .getSubmittedForm(this.formID, form.os)
          .then((form) => {
            // console.log(form);
            this.form = form.form;
            // console.log(this.form);
            this.formRev = form._rev;
            // this.formGroupService.newFormGroup(this.form, false);
            this.router.navigate(['/home']);
          })
          .catch((err) => console.error(err));
      });
    }
  }

  permanentlyCommitForm() {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const clientIdObj = pouchCollate.parseIndexableString(decodeURI(form.client));
    form = this.formGroupService.compress(form);
    form.familyID = clientIdObj[0];
    form.status.push({
      value: 'permanent',
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: '',
      username: this.databaseService.activeUser.getValue().getName(),
    });
    const id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
      this.submitted = doc;
      this.databaseService.archiveForm(form, this.formID).then((doc) => {
        this.submitted = doc;
        this.formID = doc.id;
        if (form.name === 'Termination Form') {
          this.databaseService.getFamily(id[0]).then((family) => {
            // update adult to terminated
            family[id[1]][id[2]].terminated = true;
            this.databaseService.putFamily(family).then((putResult) => {
              this.router.navigate(['/home']);
            });
          });
        } else {
          this.router.navigate(['/home']);
        }
      });
    });
  }

  delete() {
    this.databaseService.deleteForm(this.formID).then((doc) => {
      this.submitted = doc;
      this.openDialog(true);
    });
  }

  openDialog(goHome: boolean, form = null): void {
    let dialogRef = this.dialog.open(SubmittedDialogComponent, {
      data: { submitted: [this.submitted] },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (goHome) {
        this.formGroup = null;
        this.router.navigate(['/home']);
      } else {
        if (form) {
          this.formGroupService.newFormGroup(form, false);
        }
      }
    });
  }

  confirmDialogue(action, actionName, message, dismassMsg, successMsg) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'commit':
            this.permanentlyCommitForm();
            break;
          case 'sendback':
            this.saveToPool();
            break;
        }
        this.snackBar.open(successMsg, 'Close', { duration: 2000 });
      } else {
        this.snackBar.open(dismassMsg, 'Close', { duration: 2000 });
      }
    });
  }
  getID(id) {
    return encodeURI(id);
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

  navigateBack() {
    this.location.back();
  }

  setClient() {
    if (this.clientID !== ' ') {
      if (this.formGroup) {
        this.formGroup.controls.client.setValue(this.clientID);
      }
      this.databaseService.getClient(pouchCollate.parseIndexableString(decodeURI(this.clientID))).then((client) => {
        // console.log(client);
        this.visitedClient = client;
      });
    }
  }
  isCompressed(form) {
    return form.contents ? true : false;
  }
}
