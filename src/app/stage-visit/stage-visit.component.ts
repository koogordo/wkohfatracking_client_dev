import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../_services/database.service';
import { ConnectionService } from '../_services/connection.service';
import * as $PouchDB from 'pouchdb';
const PouchDB = $PouchDB['default'];
var pouchCollate = require('pouchdb-collate');
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { FormGroupService } from '../_services/form-group-service.service';
@Component({
  selector: 'app-stage-visit',
  templateUrl: './stage-visit.component.html',
  styleUrls: ['./stage-visit.component.scss'],
})
export class StageVisitComponent implements OnInit {
  stageVisitForm = new FormGroup({
    formType: new FormControl('', Validators.required),
    client: new FormControl('', Validators.required),
  });
  _offlineDB: PouchDB.Database;
  clientFamilies;
  online;
  formState: any;
  forms;
  stagedVisits;

  constructor(private _db: DatabaseService, private _conn: ConnectionService, private _fg: FormGroupService) {
    this._offlineDB = new PouchDB('offlineVisits');
  }

  ngOnInit() {
    this.formState = {
      formTypeOptions: [],
      clientOptions: [],
    };
    this.online = this._conn.connection().getValue();
    this.refreshPage();
  }

  setClientFamilies() {
    return this._db.getFamiliesWithForms(this._db.activeUser.getValue().getRemoteUserDB()).then((families) => {
      this.clientFamilies = families;
    });
  }

  refreshPage() {
    this.online = this._conn.connection().getValue();
    if (this.online) {
      console.log('We are online');
      this.setClientFamilies().then(() => {
        this.setClientOptions();
        this.setForms().then(() => {
          this.setFormTypeOptions();
          this.updateStagedVisits();
        });
      });
    } else {
      this.updateStagedVisits();
    }
  }

  goOffline() {
    this.online = false;
    this._conn.setOffline();
  }

  setClientOptions() {
    for (const family of this.clientFamilies) {
      // for (const adult of family.adult) {
      //   if (
      //     this.formState.clientOptions
      //       .map((adult) => {
      //         return adult.clientID;
      //       })
      //       .indexOf(adult.clientID) < 0
      //   ) {
      //     this.formState.clientOptions.push(adult);
      //   }
      // }

      for (let adult in family.adult) {
        var temp = {
          clientFName: family.adult[adult]['clientFName'],
          clientLName: family.adult[adult]['clientLName'],
          clientType: 'adult',
          terminated: family.adult[adult].terminated !== undefined ? family.adult[adult].terminated : false,
          clientID: family.adult[adult]['clientID'] || encodeURI(pouchCollate.toIndexableString([family._id, 'adult', adult])),
        };
        if (
          this.formState.clientOptions
            .map((adult) => {
              return adult.clientID;
            })
            .indexOf(temp.clientID) < 0
        ) {
          this.formState.clientOptions.push(temp);
        }
      }
      // for (const child of family.child) {
      //   if (
      //     this.formState.clientOptions
      //       .map((child) => {
      //         return child.clientID;
      //       })
      //       .indexOf(child.clientID) < 0
      //   ) {
      //     this.formState.clientOptions.push(child);
      //   }
      // }
      for (let child in family.child) {
        var temp = {
          clientFName: family.child[child]['clientFName'],
          clientLName: family.child[child]['clientLName'],
          clientType: 'child',
          terminated: family.child[child].terminated !== undefined ? family.child[child].terminated : false,
          clientID: family.child[child]['clientID'] || encodeURI(pouchCollate.toIndexableString([family._id, 'child', child])),
        };
        if (
          this.formState.clientOptions
            .map((child) => {
              return child.clientID;
            })
            .indexOf(temp.clientID) < 0
        ) {
          this.formState.clientOptions.push(temp);
        }
      }
    }
  }

  setForms() {
    return this._db.getForms().then((forms) => {
      this.forms = forms.filter((form) => {
        return ['Adult Visit', 'Child Visit', 'Parent Survey', 'Closure Form'].indexOf(form.form.name) >= 0;
      });
    });
  }

  setFormTypeOptions() {
    for (const form of this.forms) {
      if (
        this.formState.formTypeOptions
          .map((form) => {
            return form._id;
          })
          .indexOf(form._id) < 0
      ) {
        this.formState.formTypeOptions.push(form);
      }
    }
  }
  stageVisitSubmit() {
    if (this.stageVisitForm.valid) {
      const formID = this.stageVisitForm.controls.formType.value;
      const form = this.formState.formTypeOptions
        .map((formTypeOption) => {
          return formTypeOption;
        })
        .filter((formTypeOption) => {
          return formTypeOption._id === formID;
        })[0];

      const clientID = this.stageVisitForm.controls.client.value;
      form.form.client = clientID;
      const client = this.formState.clientOptions
        .map((clientOption) => {
          return clientOption;
        })
        .filter((clientOption) => {
          return clientOption.clientID === clientID;
        })[0];
      const os = this._db.activeUser.getValue().getName();

      this._db.getAllClientFormsByType(client.clientID, form.form.name).then((forms) => {
        forms.sort((a, b) => {
          let aDateQg, bDateQg, aDate, bDate;
          if (this.isCompressed(a.form) && this.isCompressed(b.form)) {
            aDateQg = a.form.contents.filter((questionContent) => {
              return questionContent.key === 'Visit Date';
            })[0];
            aDate = aDateQg.value;
            bDateQg = b.form.contents.filter((questionContent) => {
              return questionContent.key === 'Visit Date';
            })[0];
            bDate = bDateQg.value;
          } else if (this.isCompressed(a.form)) {
            aDateQg = a.form.contents.filter((questionContent) => {
              return questionContent.key === 'Visit Date';
            })[0];
            aDate = aDateQg.value;
            bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, 'Visit Date')).input;
          } else if (this.isCompressed(b.form)) {
            bDateQg = b.form.contents.filter((questionContent) => {
              return questionContent.key === 'Visit Date';
            })[0];
            bDate = bDateQg.value;
            aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, 'Visit Date')).input;
          } else {
            aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, 'Visit Date')).input;
            bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, 'Visit Date')).input;
          }
          a = moment(aDate);
          b = moment(bDate);
          if (a.isAfter(b)) {
            return -1;
          } else if (b.isAfter(a)) {
            return 1;
          } else {
            return 0;
          }
        });
        form.form.status.push({
          value: 'open',
          usersAllowed: [this._db.activeUser.getValue().getName()],
          rolesAllowed: [],
          date: moment().format(),
          message: '',
          username: this._db.activeUser.getValue().getName(),
        });
        let previousForm;
        if (forms.length > 0) {
          previousForm = this.isCompressed(forms[0].form) ? forms[0].form : this._fg.compress(forms[0].form);
        } else {
          previousForm = null;
        }
        const stagedVisit: any = {
          _id: encodeURI(pouchCollate.toIndexableString([os, client.clientID, moment().unix()])),
          form: this.isCompressed(form.form) ? form.form : this._fg.compress(form.form),
          client,
          previousForm,
          formTemplate: form,
        };
        console.dir(stagedVisit);
        this._offlineDB.put(stagedVisit).then((putResult) => {
          this.updateStagedVisits();
        });
      });
    }
  }

  updateStagedVisits() {
    this._offlineDB.allDocs({ include_docs: true }).then((payload) => {
      this.stagedVisits = payload.rows.map((row) => {
        return row.doc;
      });
    });
  }

  formStatus(form) {
    if (form.status.length > 0) {
      return form.status[form.status.length - 1].value;
    } else {
      return 'Visit Not Started';
    }
  }
  isCompressed(form) {
    return form.contents ? true : false;
  }
  deleteStagedVisit(id) {
    this._offlineDB.get(id).then((doc: any) => {
      this._offlineDB.remove(doc).then((removeRes) => {
        if (removeRes.ok) {
          this.updateStagedVisits();
        }
      });
    });
  }

  submitStagedForm(id) {
    this._offlineDB.get(id).then((doc: any) => {
      const formToSubmit = doc.form;
      formToSubmit.status.push({
        value: 'submitted',
        usersAllowed: [this._db.activeUser.getValue().getName()],
        rolesAllowed: [],
        date: moment().format(),
        message: '',
        username: this._db.activeUser.getValue().getName(),
      });
      this._offlineDB.remove(doc).then((removeRes) => {
        if (removeRes.ok) {
          this._db.saveForm(formToSubmit).then((saveRes) => {
            this.updateStagedVisits();
          });
        }
      });
    });
  }
}
