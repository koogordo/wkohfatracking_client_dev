import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { DatabaseService } from "../_services/database.service";
import { FormGroupService } from "../_services/form-group-service.service";
import { SubmittedDialogComponent } from "../components/submitted-dialog/submitted-dialog.component";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import { Form } from "../_models/form";
import { ViewNotesComponent } from "../components/view-notes/view-notes.component";
import { PreviewFormComponent } from "../components/preview-form/preview-form.component";
import * as moment from "moment";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { ConnectionService } from "../_services/connection.service";
declare var require: any;
var pouchCollate = require("pouchdb-collate");
import * as $PouchDB from "pouchdb";
import { decode } from "@angular/router/src/url_tree";
import { ClientSocketService } from "../_services/client-socket.service";
import { IWKORequest } from "../_services/WKOCommunication";
const PouchDB = $PouchDB["default"];
const log = console.log;
@Component({
  selector: "app-os-view-form",
  templateUrl: "./os-view-form.component.html",
  styleUrls: ["./os-view-form.component.scss"],
})
export class OsViewFormComponent implements OnInit, OnDestroy {
  @Input()
  form: Form;
  @Input()
  disabled;
  @Input()
  cleared;
  @ViewChild("cardView")
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
  pastVisitForms;
  queryParams;
  previousFormGroup;
  visitedClient;
  previewMode;
  forms: BehaviorSubject<any>;
  online;
  formTemplates: any[];
  state: any = {};
  setupTasks: Promise<any>[] = [];
  stagedVisitObj;
  offlineDB: PouchDB.Database;
  constructor(
    private databaseService: DatabaseService,
    private formGroupService: FormGroupService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _conn: ConnectionService,
    private _socket: ClientSocketService
  ) {}

  ngOnInit() {
    this.online = this._conn.connection().getValue();
    console.log(this.online);

    this.previewMode = false;
    combineLatest(this.route.params, this.route.queryParams)
      .pipe(map((results) => ({ params: results[0], queryParams: results[1] })))
      .subscribe(({ params, queryParams }) => {
        this.state.formID = params["id"];
        this.state.queryParams = queryParams;
        this.state.isNewForm = this.state.formID.startsWith("54blankForm"); // flag to check to see if this is a new visit or not
        // Check to see if this is an online session and it is not a staged visit.

        if (this.online && !this.state.queryParams.stagedVisit) {
          this.setClient(this.state.queryParams["client"]);
          this.databaseService.getForms().then((forms) => {
            this.formTemplates = forms;
            if (this.state.isNewForm) {
              // Visit is a new form so previous form needs to be set and all past visits for a client need to be fetched;

              this.state.formTemplate = this.getCorrectFormTemplate(this.formTemplates);
              //console.log(this.getCorrectFormTemplate(this.formTemplates));
              //console.log(this.state.formTemplate);
              this.setFormMetaData(this.state.formTemplate);
              this.setupPreviousForms().then((prevForms) => {
                this.state.previousForms = this.pastVisitForms = prevForms;
                this.formGroupService.newFormGroup(this.form, true);
                this.pastVisitForms.length > 0 ? this.formGroupService.newPrevFormGroup(this.pastVisitForms[0].form) : this.formGroupService.newPrevFormGroup(null);
              });
            } else {
              // This is an existing visit so the existing form needs to be fetched from the database;
              this.databaseService.getSubmittedForm(this.state.formID).then((submittedForm) => {
                this.state.formTemplate = this.getCorrectFormTemplate(this.formTemplates, submittedForm.form.name);
                this.setFormMetaData(submittedForm);
                this.setupPreviousForms().then((prevForms) => {
                  this.state.previousForms = this.pastVisitForms = prevForms;
                  this.formGroupService.newFormGroup(this.form, true);
                  this.formGroupService.newPrevFormGroup(null);
                });
              });
            }
          });
        } else {
          // offline or online but working with a staged visit
          if (this.state.queryParams["stagedVisit"]) {
            this.offlineDB = new PouchDB("offlineVisits");
            this.offlineDB.get(this.state.queryParams.stagedVisitID).then((visit: any) => {
              this.stagedVisitObj = visit;
              this.clientID = visit.client.clientID;
              console.log(visit.client);
              this.clientID = visit.client.clientID;
              this.client = visit.client;
              if (this.formGroup) {
                this.formGroup.controls.client.setValue(this.clientID);
              }
              //this.setClient(visit.client.clientID);
              const expandForm = this.formGroupService.expand(visit.formTemplate.form, visit.form);
              this.form = expandForm;
              this.formGroupService.newFormGroup(this.form, true);
              if (visit.previousForm) {
                console.dir(visit.previousForm);
                const expandPrevForm = this.formGroupService.expand(visit.formTemplate.form, visit.previousForm);
                this.formGroupService.newPrevFormGroup(expandPrevForm);
              }
            });
          }
        }
      });
    this.formGroupService.formGroup.subscribe((formGroup) => {
      this.formGroup = formGroup;
      if (formGroup.getRawValue().status.length != 0) {
        this.curStatus = formGroup.getRawValue().status[formGroup.getRawValue().status.length - 1]["value"];
      } else {
        this.curStatus = "open";
      }
    });
    this._socket.requestErrors().subscribe((data) => {
      if (data) {
        // somehow notify the user that there was an error and to try again but for now just console.log(data);
        this.curStatus = "open";
        console.log(data);
      }
    });
  }

  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  setClient(clientID) {
    if (clientID) {
      // There is a client that was passed in through the url so set the clientID accordingly

      this.clientID = clientID || " ";
      if (this.clientID !== " ") {
        if (this.formGroup) {
          this.formGroup.controls.client.setValue(this.clientID);
        }
        this.databaseService.getClient(pouchCollate.parseIndexableString(decodeURI(this.clientID))).then((client) => {
          this.client = client;
          this.visitedClient = client;
        });
      }
    } else {
      this.clientID = "";
    }
  }

  setFormMetaData(form) {
    if (!this.isCompressed(form.form) && !this.state.isNewForm) {
      form.form = this.formGroupService.compress(form.form);
      this.form = this.formGroupService.expand(this.state.formTemplate.form, form.form);
      this.form.client = this.form.client === "" ? this.clientID : this.form.client;
      this.form.formID = form.form.formID;
      this.form.formRev = form.form.formRev;
      this.formRev = form.form.formRev;
    } else if (this.isCompressed(form.form)) {
      this.form = this.formGroupService.expand(this.state.formTemplate.form, form.form);
      this.form.client = this.form.client === "" ? this.clientID : this.form.client;
      this.form.formID = form.form.formID;
      this.form.formRev = form.form.formRev;
      this.formRev = form.form.formRev;
    } else {
      this.form = form.form;
      this.form.client = this.form.client === "" ? this.clientID : this.form.client;
      this.form.formID = form._id;
      this.form.formRev = form._rev;
      this.formRev = this.form.formRev;
    }
  }

  getCorrectFormTemplate(templates, name = null) {
    if (!name) {
      return templates.filter((template) => {
        return template._id === this.state.formID;
      })[0];
    } else {
      return templates.filter((template) => {
        return template.form.name === name;
      })[0];
    }
  }

  removeOpenForms(forms) {
    return forms.filter((form) => {
      return form.form.status[form.form.status.length - 1].value !== "open";
    });
  }

  setupPreviousForms() {
    const formSetupTasks: Promise<any>[] = [];
    formSetupTasks.push(this.databaseService.getAllClientFormsByType(this.clientID, this.form.name));
    formSetupTasks.push(this.databaseService.getAllClientArchivedVisits(this.clientID, this.form.name));
    return Promise.all(formSetupTasks).then(([activeForms, archivedForms]) => {
      const prevActiveForms = this.removeOpenForms(activeForms);
      const prevForms = prevActiveForms.concat(archivedForms);
      return this.sortForms(this.expandCompressedForms(prevForms));
    });
  }
  sortForms(forms) {
    return forms.sort((a, b) => {
      const aDate = this.formGroupService.findFormPartByIndex(a.form, this.formGroupService.indexQuestionGroup(a.form, "Visit Date")).input;
      const bDate = this.formGroupService.findFormPartByIndex(b.form, this.formGroupService.indexQuestionGroup(b.form, "Visit Date")).input;
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
  }
  expandCompressedForms(forms) {
    for (const form of forms) {
      this.isCompressed(form.form) ? (form.form = this.formGroupService.expand(this.state.formTemplate.form, form.form)) : (form.form = form.form);
    }
    return forms;
  }
  isCompressed(form) {
    return form.contents ? true : false;
  }
  getStatusVal(status): number {
    var statuses = {
      open: 0,
      "action required": 1,
      permanent: 4,
      queued: 3,
      "reviewer pool": 2,
      "under review": 2,
      submitted: 1,
    };
    return statuses[status];
  }

  transitionForm(newStatus) {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const returnFamily = pouchCollate.parseIndexableString(decodeURI(this.clientID))[0];
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    form.status.push({
      value: newStatus,
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    });
    const uncompressedForm = JSON.parse(JSON.stringify(form));
    form = this.formGroupService.compress(form);
    this.curStatus = newStatus;
    if (this.state.formID.startsWith("54blankForm")) {
      // brand new visit, has not yet been saved or submitted
      const clientID = pouchCollate.parseIndexableString(decodeURI(form.client));
      //make new id
      const id = encodeURI(pouchCollate.toIndexableString([clientID[0], clientID[1], clientID[2], visitDate.input, form.name, moment().unix()]));
      this.formID = id;
      // need to notify review groups to update their homepage visits
      const formDoc = {
        _id: this.formID,
        form,
      };
      this.formID = this.state.formID = formDoc._id;
      if (newStatus === "submitted") {
        this._socket.makeRequest("update", this.databaseService.activeUser.getValue(), formDoc, true, this.databaseService.activeUser.getValue().getName());
      } else {
        this._socket.makeRequest("update", this.databaseService.activeUser.getValue(), formDoc, false, this.databaseService.activeUser.getValue().getName());
      }
    } else {
      // this is an existing visit, the document should only be updated in the appropriate database
      // the appropriate database is active user database if i am os, otherwise i have to pass correct os database
      const formDoc = {
        _id: this.formID,
        _rev: this.formRev,
        form,
      };
      if (newStatus === "submitted") {
        this._socket.makeRequest("update", this.databaseService.activeUser.getValue(), formDoc, true, this.databaseService.activeUser.getValue().getName());
      } else {
        this._socket.makeRequest("update", this.databaseService.activeUser.getValue(), formDoc, false, this.databaseService.activeUser.getValue().getName());
      }
    }
    const newFG = this.formGroupService.buildFormGroup(uncompressedForm);
    this.formGroupService.formGroupBS.next(newFG);
  }

  pullBack() {
    // this.youngerMoreorEquivAdvancedForms(form).then(forms => {
    //   console.log(forms);
    //   if (forms.length === 0) {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    form = this.formGroupService.compress(form);
    form.status.push({
      value: "open",
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    });
    var id = pouchCollate.parseIndexableString(decodeURI(this.state.formID));
    if (id[3] !== visitDate) {
      this.databaseService.deleteForm(this.state.formID).then((doc) => {
        this.submitted = doc;
        // this.openDialog(false);
        this.databaseService.saveForm(form).then((doc) => {
          this.submitted = doc;
          this.state.formID = doc.id;
          // this.openDialog(false);
          this.databaseService.getSubmittedForm(this.state.formID).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.state.formTemplate.form, form.form) : form.form;
            this.formRev = form._rev;
            this.formGroupService.newFormGroup(this.form, false);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.state.formID).then((doc) => {
        this.submitted = doc;
        // this.openDialog(false);
        this.databaseService.getSubmittedForm(this.state.formID).then((form) => {
          this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.state.formTemplate.form, form.form) : form.form;
          this.formRev = form._rev;
          this.formGroupService.newFormGroup(this.form, false);
        });
      });
    }
  }

  save() {
    // this.youngerMoreAdvancedForms(form).then(forms => {
    //   if (forms.length === 0) {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const returnFamily = pouchCollate.parseIndexableString(decodeURI(this.clientID))[0];
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    form = this.formGroupService.compress(form);
    if (this.online && !this.state.queryParams.stagedVisit) {
      if (this.state.formID.startsWith("54blankForm")) {
        form.status.push(this.updateFormStatus("open"));
        form.os = this.databaseService.activeUser.getValue().getName();
        form.formRev = this.formRev;
        form.formID = this.state.formID;
        this.databaseService.saveForm(form).then((doc) => {
          this.submitted = doc;
          this.state.formID = doc.id;
          this.router.navigate(["/viewForm", doc.id], { queryParams: { client: decodeURI(this.clientID) } });
          // this.router.navigate(['/home'], { queryParams: { returnFamily } });
        });
      } else {
        // console.log(form);
        form.status.push({
          value: "open",
          usersAllowed: [this.databaseService.activeUser.getValue().getName()],
          rolesAllowed: [],
          date: moment().format(),
          message: "",
          username: this.databaseService.activeUser.getValue().getName(),
        });
        var id = pouchCollate.parseIndexableString(decodeURI(this.state.formID));
        // if (id[3] !== visitDate) {
        //   this.databaseService.deleteForm(this.state.formID).then((doc) => {
        //     this.submitted = doc;
        //     this.databaseService.saveForm(form).then((doc) => {
        //       this.submitted = doc;
        //       this.state.formID = doc.id;
        //       console.log(doc);
        //       //this.formGroupService.newFormGroup(form, false);
        //       // this.router.navigate(['/home'], { queryParams: { returnFamily } });
        //     });
        //   });
        // } else {
        this.databaseService.editSubForm(form, this.state.formID).then((doc) => {
          this.form = this.isCompressed(form) ? this.formGroupService.expand(this.state.formTemplate.form, form) : form;
          this.submitted = doc;
          this.formGroupService.newFormGroup(this.form, false);
          // this.router.navigate(['/home'], { queryParams: { returnFamily } });
        });
      }
    } else {
      form.status.push(this.updateFormStatus("open"));
      this.offlineDB
        .get(this.stagedVisitObj._id)
        .then((visitDoc: any) => {
          visitDoc.form = form;
          const temp = JSON.stringify(visitDoc);
          visitDoc = JSON.parse(temp);
          this.offlineDB
            .put(visitDoc)
            .then((putRes) => {
              this.form = this.isCompressed(form) ? this.formGroupService.expand(this.stagedVisitObj.formTemplate.form, form) : form;
              this.formGroupService.newFormGroup(this.form, false);
            })
            .catch((err) => {
              throw err;
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  submit() {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const returnFamily = pouchCollate.parseIndexableString(decodeURI(this.clientID))[0];
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    form = this.formGroupService.compress(form);
    if (this.state.formID.startsWith("54blankForm")) {
      form.status.push({
        value: "submitted",
        usersAllowed: [this.databaseService.activeUser.getValue().getName()],
        rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
        date: moment().format(),
        message: "",
        username: this.databaseService.activeUser.getValue().getName(),
      });
      form.os = this.databaseService.activeUser.getValue().getName();
      form.formRev = this.formRev;
      form.formID = this.state.formID;
      this.databaseService.saveForm(form).then((doc) => {
        this.submitted = doc;
        this.state.formID = doc.id;
        // this.openDialog(false);
        //this.databaseService.getSubmittedForm(this.state.formID).then((form) => {
        //this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.state.formTemplate.form, form.form) : form.form;;
        //this.formRev = form._rev;
        //this.formGroupService.newFormGroup(this.form);
        this.router.navigate(["/home"], { queryParams: { returnFamily } });
        //});
      });
    } else {
      form.status.push({
        value: "submitted",
        usersAllowed: [this.databaseService.activeUser.getValue().getName()],
        rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
        date: moment().format(),
        message: "",
        username: this.databaseService.activeUser.getValue().getName(),
      });
      var id = pouchCollate.parseIndexableString(decodeURI(this.state.formID));
      if (id[3] !== visitDate) {
        this.databaseService.deleteForm(this.state.formID).then((doc) => {
          this.submitted = doc;
          // this.openDialog(false);
          this.databaseService.saveForm(form).then((doc) => {
            this.submitted = doc;
            this.state.formID = doc.id;
            // this.openDialog(false);
            this.databaseService.getSubmittedForm(this.state.formID).then((form) => {
              this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.state.formTemplate.form, form.form) : form.form;
              this.formRev = form._rev;
              // this.formGroupService.newFormGroup(this.form, false);
              this.router.navigate(["/home"], { queryParams: { returnFamily } });
            });
          });
        });
      } else {
        this.databaseService.editSubForm(form, this.state.formID).then((doc) => {
          this.submitted = doc;
          // this.openDialog(false);
          this.databaseService.getSubmittedForm(this.state.formID).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.state.formTemplate.form, form.form) : form.form;
            this.formRev = form._rev;
            // this.formGroupService.newFormGroup(this.form, false);
            this.router.navigate(["/home"], { queryParams: { returnFamily } });
          });
        });
      }
    }
  }

  newFamily() {
    const form = this.formGroupService.formGroupBS.getValue().getRawValue();
    this.databaseService.addNewFamily(form).then((res) => {
      this.router.navigate(["/home"], { queryParams: { returnFamily: form.tabs[0].sections[0].rows[2].columns[0].questions[0].input } });
    });
  }
  delete() {
    const returnFamily = pouchCollate.parseIndexableString(decodeURI(this.clientID))[0];
    this.databaseService.deleteForm(this.state.formID).then((doc) => {
      this.router.navigate(["/home"], { queryParams: { returnFamily } });
    });
  }

  openDialog(goHome: boolean, form = null): void {
    let dialogRef = this.dialog.open(SubmittedDialogComponent, {
      data: { submitted: [this.submitted] },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (goHome) {
        this.formGroup = null;
        this.router.navigate(["/home"], { queryParams: this.queryParams });
      } else {
        if (form) {
          this.formGroupService.newFormGroup(form, false);
        }
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

  getFormDate(form) {
    const index = this.formGroupService.indexQuestionGroup(form.form, "Visit Date");
    const fg = this.formGroupService.findFormPartByIndex(form.form, index);
    return moment(fg.input).format("DD MMM YYYY");
  }

  openPreviewDialog(form) {
    let dialogRef = this.dialog.open(PreviewFormComponent, {
      width: "90%",
      position: {
        top: "10%",
        left: "10%",
      },
      data: { formGroup: JSON.parse(JSON.stringify(form.form)) },
    });
    dialogRef.afterClosed().subscribe((response) => {
      this.formGroupService.newFormGroup(this.formGroupService.formGroupBS.getValue().getRawValue(), false);
    });
  }

  confirmDialogue(action, actionName, message, dismassMsg, successMsg) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case "save":
            //this.save();
            this.transitionForm("open");
            break;
          case "submit":
            this.transitionForm("submitted");
            break;
          case "pullback":
            //this.pullBack();
            this.transitionForm("open");
            break;
          case "delete":
            this.delete();
            break;
          case "saveFamily":
            this.newFamily();
            break;
        }
        this.snackBar.open(successMsg, "", { duration: 2000 });
      } else {
        this.snackBar.open(dismassMsg, "", { duration: 2000 });
      }
    });
  }

  updateFormStatus(status): any {
    return {
      value: status,
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: [],
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    };
  }
}
