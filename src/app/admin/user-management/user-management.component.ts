import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/database.service';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
const pouchCollate = require('pouchdb-collate');
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  formGroupToView;
  formID;
  errorInClientIds;
  clientIdError;
  isAddUser;
  isUpdateUser;
  clientID;
  constructor(private _db: DatabaseService, private _fg: FormGroupService, private _dialog: MatDialog, private _route: ActivatedRoute, private _router: Router) {
    this.isAddUser = false;
    this.isUpdateUser = false;
  }
  ngOnInit() {
    this.errorInClientIds = false;
    this._fg.formGroup.subscribe((formGroup) => {
      // this.disableReadOnlyFields();
      this.formGroupToView = formGroup;
    });
    this._route.params.subscribe((params) => {
      if (params['id'] === 'addNew') {
        if (
          this._db.activeUser
            .getValue()
            .getRoles()
            .indexOf('_admin') < 0
        ) {
          this._router.navigate(['/home']);
        }
        this.isAddUser = true;
        this.isUpdateUser = false;
        this._db.getForm('54blankForm%004Add%20Os%00%00').then((form) => {
          // console.log(form);
          this.clientID = encodeURI(pouchCollate.toIndexableString('id_to_be_set'));
          this.formID = form._id;
          this._fg.newFormGroup(form.form, false);
        });
      } else {
        this.isAddUser = false;
        this.isUpdateUser = true;
        this._db.getUser(params['id']).then((doc) => {
          // console.log(doc);
          if (!doc.form) {
            this._db.getForm('54blankForm%004Add%20Os%00%00').then((form) => {
              // console.log(form);
              this.formID = form._id;
              this.clientID = encodeURI(pouchCollate.toIndexableString('id_to_be_set'));
              this._fg.newFormGroup(form.form, false);
            });
          } else {
            this.formID = doc._id;

            this.clientID = encodeURI(pouchCollate.toIndexableString(doc._id));
            this._fg.newFormGroup(doc.form, false);
          }
        });
      }
    });
  }

  confirmDialogue(action, actionName, message, dismassMsg, successMsg) {
    let dialogRef = this._dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'add':
            this.addUser();
            break;
          case 'update':
            this.updateUser();
            break;
        }
      }
    });
  }

  addUser() {
    const form = this._fg.formGroupBS.getValue().getRawValue();
    const userNameFromForm = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
    this._db
      .addUser(form)
      .then(([putDocResult, familyIDs]) => {
        this._db
          .putClientDoc(userNameFromForm, familyIDs)
          .then((putDocResult) => {
            this._db.activeUser.next(this._db.activeUser.getValue());
            this._router.navigate(['/home']);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        if (err.message.startsWith('Invalid family id(s):')) {
          this.errorInClientIds = true;
          this.clientIdError = err.message;
        } else {
          console.log(err);
        }
      });
  }

  updateUser() {
    const form = this._fg.formGroupBS.getValue().getRawValue();
    const userNameFromForm = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
    this._db
      .updateUser(form)
      .then(([userRes, familyIDs]) => {
        this._db
          .putClientDoc(userNameFromForm, familyIDs)
          .then((clientDocRes) => {
            this._db.activeUser.next(this._db.activeUser.getValue());
            if (
              this._db.activeUser
                .getValue()
                .getRoles()
                .indexOf('OS') >= 0
            ) {
              this._router.navigate(['/home'], { queryParams: { returnFamily: familyIDs[0] } });
            } else {
              this._router.navigate(['/home']);
            }
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        if (err.message.startsWith('Invalid family id(s):')) {
          this.errorInClientIds = true;
          this.clientIdError = err.message;
        } else {
          console.log(err);
        }
      });
  }
}
