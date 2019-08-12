import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroupService } from "../_services/form-group-service.service";
import { DatabaseService } from "../_services/database.service";
import { SubmittedDialogComponent } from "../components/submitted-dialog/submitted-dialog.component";
import { Form } from "../_models/form";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";
import * as moment from "moment";
declare var require: any;
var pouchCollate = require("pouchdb-collate");
import * as $PouchDB from "pouchdb";
import { query } from "@angular/core/src/render3";
import { IWKORequest } from "../_services/WKOCommunication";
import { ClientSocketService } from "../_services/client-socket.service";
const PouchDB = $PouchDB["default"];

@Component({
  selector: "app-reviewer-view-form",
  templateUrl: "./reviewer-view-form.component.html",
  styleUrls: ["./reviewer-view-form.component.scss"],
})
export class ReviewerViewFormComponent implements OnInit, OnDestroy {
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
  curOS;
  returnFamily: string;
  returnNavExtras: NavigationExtras;
  visitedClient;
  templateForm;
  constructor(
    private databaseService: DatabaseService,
    private formGroupService: FormGroupService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _socket: ClientSocketService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.queryParams.subscribe((queryParams) => {
        if (queryParams["OS"]) {
          this.curOS = queryParams["OS"];
          this.returnFamily = queryParams["returnFamily"];
          this.returnNavExtras = {
            queryParams: {
              OS: queryParams["OS"],
              returnFamily: queryParams["returnFamily"],
            },
          };

          this.subscriptions.push(
            this.route.params.subscribe((params) => {
              if (params["id"]) {
                this.databaseService.getForms().then((forms) => {
                  this.formID = params["id"];
                  this.databaseService.getSubmittedForm(this.formID, this.curOS.toLowerCase()).then((form) => {
                    this.templateForm = forms.filter((f) => {
                      return f.form.name === form.form.name;
                    })[0];
                    this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
                    this.formRev = form._rev;
                    this.clientID = this.form.client || " ";
                    this.setClient();
                    this.formGroupService.newFormGroup(this.form, false);
                  });
                });
                this.subscriptions.push(
                  this.formGroupService.formGroup.subscribe((formGroup) => {
                    this.formGroup = formGroup;
                    // console.log(this.formGroup);
                    this.curStatus = this.formGroup.value.status[formGroup.value.status.length - 1]["value"];
                    // console.log(this.curStatus);
                  })
                );
              }
            })
          );
        }
      })
    );
    this._socket.requestErrors().subscribe((err) => {
      console.log(err);
    });
  }
  initForms() {}
  ngOnDestroy() {
    for (let sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  setClient() {
    if (this.clientID !== " ") {
      if (this.formGroup) {
        this.formGroup.controls.client.setValue(this.clientID);
      }
      this.databaseService.getClient(pouchCollate.parseIndexableString(decodeURI(this.clientID))).then((client) => {
        // console.log(client);
        this.visitedClient = client;
      });
    }
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
    if (this.formID.startsWith("54blankForm")) {
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
      this.formID = this.formID = formDoc._id;

      this._socket.makeRequest("update", this.databaseService.activeUser.getValue(), formDoc, true, this.curOS);
    } else {
      // this is an existing visit, the document should only be updated in the appropriate database
      // the appropriate database is active user database if i am os, otherwise i have to pass correct os database
      const formDoc = {
        _id: this.formID,
        _rev: this.formRev,
        form,
      };
      console.log("FORMDOC", formDoc);
      this._socket.makeRequest("update", this.databaseService.activeUser.getValue(), formDoc, true, this.curOS);
    }
    this.databaseService.getVisit(this.formID, this.curOS).then((formDoc) => {
      console.log(this.formRev, formDoc._rev);
      this.formRev = formDoc._rev;
      this.formID = formDoc._id;
    });
    const newFG = this.formGroupService.buildFormGroup(uncompressedForm);
    this.formGroupService.formGroupBS.next(newFG);
  }

  startReview() {
    // this.olderLessorEquivAdvancedForms(form).then(forms => {
    //   if (forms.length === 0) {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    //this._socket.makeRequest(this.databaseService.activeUser.getValue(), { _id: this.formID, _rev: this.formRev, form });
    form = this.formGroupService.compress(form);
    form.status.push({
      value: "under review",
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    });
    var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    if (id[3] !== visitDate) {
      this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
        this.submitted = doc;
        this.databaseService.saveForm(form, form.os).then((doc) => {
          this.submitted = doc;
          this.formID = doc.id;
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            this.formRev = form._rev;
            this.formGroupService.newFormGroup(this.form, false);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
          this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
          this.formRev = form._rev;
          this.formGroupService.newFormGroup(this.form, false);
        });
      });
    }
  }

  saveToPool() {
    // this.olderLessAdvancedForms(form).then(forms => {
    //   if (forms.length === 0)
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;

    form = this.formGroupService.compress(form);
    form.status.push({
      value: "reviewer pool",
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    });
    //this._socket.makeRequest(this.databaseService.activeUser.getValue(), { _id: this.formID, _rev: this.formRev, form });
    var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    if (id[3] !== visitDate) {
      this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.saveForm(form, form.os).then((doc) => {
          this.submitted = doc;
          this.formID = doc.id;
          //this.openDialog(false);
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            // console.log(this.form);
            this.formRev = form._rev;
            this.formGroupService.newFormGroup(this.form, false);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        // console.log(this.submitted);
        this.databaseService
          .getSubmittedForm(this.formID, form.os)
          .then((form) => {
            // console.log(form);
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            // console.log(this.form);
            this.formRev = form._rev;
            this.formGroupService.newFormGroup(this.form, false);
          })
          .catch((err) => console.error(err));
      });
    }
  }
  sendBackToOS() {
    // this.youngerMoreorEquivAdvancedForms(form).then(forms => {
    //   if (forms.length === 0) {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;

    form = this.formGroupService.compress(form);
    form.status.push({
      value: "action required",
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    });
    //this._socket.makeRequest(this.databaseService.activeUser.getValue(), { _id: this.formID, _rev: this.formRev, form });
    var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    if (id[3] !== visitDate) {
      this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.saveForm(form, form.os).then((doc) => {
          this.submitted = doc;
          this.formID = doc.id;
          //this.openDialog(false);
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            this.formRev = form._rev;

            this.router.navigate(["/home"], this.returnNavExtras);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
          this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
          this.formRev = form._rev;
          this.router.navigate(["/home"], this.returnNavExtras);
        });
      });
    }
  }
  accept() {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    form = this.formGroupService.compress(form);
    form.status.push({
      value: "queued",
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    });
    var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    if (id[3] !== visitDate) {
      this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.saveForm(form, form.os).then((doc) => {
          this.submitted = doc;
          this.formID = doc.id;
          //this.openDialog(false);
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            this.formRev = form._rev;
            // this.formGroupService.newFormGroup(this.form, false);
            this.router.navigate(["/home"], this.returnNavExtras);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
          this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
          this.formRev = form._rev;
          // this.formGroupService.newFormGroup(this.form, false);
          this.router.navigate(["/home"], this.returnNavExtras);
        });
      });
    }
  }

  pullBack() {
    // this.youngerMoreorEquivAdvancedForms(form).then(forms => {
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
    var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    if (id[3] !== visitDate) {
      this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.saveForm(form, form.os).then((doc) => {
          this.submitted = doc;
          this.formID = doc.id;
          //this.openDialog(false);
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            this.formRev = form._rev;
            this.formGroupService.newFormGroup(this.form, false);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
          this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
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
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    form = this.formGroupService.compress(form);
    if (this.formID.startsWith("54blankForm")) {
      form.status.push({
        value: "under review",
        usersAllowed: [this.databaseService.activeUser.getValue().getName()],
        rolesAllowed: [],
        date: moment().format(),
        message: "",
        username: this.databaseService.activeUser.getValue().getName(),
      });
      form.os = this.databaseService.activeUser.getValue().getName();
      form.formRev = this.formRev;
      form.formID = this.formID;
      this.databaseService.saveForm(form, form.os).then((doc) => {
        this.submitted = doc;
        this.formID = doc.id;
        this.form = this.isCompressed(form) ? this.formGroupService.expand(this.templateForm.form, form) : form;
        this.formGroupService.newFormGroup(form, false);
        // this.router.navigate(['/home'], this.returnNavExtras);
      });
    } else {
      form.status.push({
        value: "under review",
        usersAllowed: [this.databaseService.activeUser.getValue().getName()],
        rolesAllowed: [],
        date: moment().format(),
        message: "",
        username: this.databaseService.activeUser.getValue().getName(),
      });
      var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
      // if (id[3] !== visitDate) {
      // this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
      //   this.submitted = doc;
      //   this.openDialog(false);
      //   this.databaseService.saveForm(form, form.os).then((doc) => {
      //     this.submitted = doc;
      //     this.formID = doc.id;
      //     this.formGroupService.newFormGroup(form, false);
      //     // this.router.navigate(['/home'], this.returnNavExtras);
      //   });
      // });
      // } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        this.form = this.isCompressed(form) ? this.formGroupService.expand(this.templateForm.form, form) : form;
        this.formGroupService.newFormGroup(this.form, false);
        // this.router.navigate(['/home'], this.returnNavExtras);
      });
      // }
    }
    //   } else {
    //     this.submitted = forms.map(form => {
    //       if (this.formID.startsWith('54blankForm')) {
    //         form.status.push({
    //           value: 'open',
    //           usersAllowed: [this.databaseService.activeUser.getValue().getName()],
    //           rolesAllowed: [],
    //           date: moment().format(),
    //           message: '',
    //           username: this.databaseService.activeUser.getValue().getName()
    //         });
    //         form.os = this.databaseService.activeUser.getValue().getName();
    //         form.formRev = this.formRev;
    //         form.formID = this.formID;
    //         this.databaseService.saveForm(form).then(doc => {
    //           this.submitted = doc;
    //           this.formID = doc.id;
    //           this.openDialog(false);
    //         });
    //       } else {
    //         form.status.push({
    //           value: 'open',
    //           usersAllowed: [this.databaseService.activeUser.getValue().getName()],
    //           rolesAllowed: [],
    //           date: moment().format(),
    //           message: '',
    //           username: this.databaseService.activeUser.getValue().getName()
    //         });
    //         var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    //         if (
    //           id[3] !==
    //           form.tabs[0].sections[0].rows[0].columns[0].questions[0].input
    //         ) {
    //           this.databaseService.deleteForm(this.formID).then(doc => {
    //             this.submitted = doc;
    //             this.openDialog(false);
    //             this.databaseService.saveForm(form).then(doc => {
    //               this.submitted = doc;
    //               this.formID = doc.id;
    //               this.openDialog(false);
    //             });
    //           });
    //         } else {
    //           this.databaseService.editSubForm(form, this.formID, form.os).then(doc => {
    //             this.submitted = doc;
    //             this.openDialog(false);
    //           });
    //         }
    //       }
    //     });
    //     this.openDialog(false);
    //   }
    // });
  }

  submit() {
    // this.olderLessAdvancedForms(form).then(forms => {
    //   if (forms.length === 0) {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;
    form = this.formGroupService.compress(form);
    if (this.formID.startsWith("54blankForm")) {
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
      form.formID = this.formID;
      this.databaseService.saveForm(form, form.os).then((doc) => {
        this.submitted = doc;
        this.formID = doc.id;
        //this.openDialog(false);
        this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
          this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
          this.formRev = form._rev;
          this.formGroupService.newFormGroup(this.form, false);
        });
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
      var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
      if (id[3] !== visitDate) {
        this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
          this.submitted = doc;
          //this.openDialog(false);
          this.databaseService.saveForm(form, form.os).then((doc) => {
            this.submitted = doc;
            this.formID = doc.id;
            //this.openDialog(false);
            this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
              this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
              this.formRev = form._rev;
              this.formGroupService.newFormGroup(this.form, false);
            });
          });
        });
      } else {
        this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
          this.submitted = doc;
          //this.openDialog(false);
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            this.formRev = form._rev;
            this.formGroupService.newFormGroup(this.form, false);
          });
        });
      }
    }
    //   } else {
    //     this.submitted = forms.map(form => {
    //       if (this.formID.startsWith('54blankForm')) {
    //         form.status.push({
    //           value: 'submitted',
    //           usersAllowed: [this.databaseService.activeUser.getValue().getName()],
    //           rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
    //           date: moment().format(),
    //           message: '',
    //           username: this.databaseService.activeUser.getValue().getName()
    //         });
    //         form.os = this.databaseService.activeUser.getValue().getName();
    //         form.formRev = this.formRev;
    //         form.formID = this.formID;
    //         this.databaseService.saveForm(form).then(doc => {
    //           this.submitted = doc;
    //           this.formID = doc.id;
    //           this.openDialog(false);
    //           this.databaseService.getSubmittedForm(this.formID, form.os).then(form => {
    //             this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;;
    //             this.formRev = form._rev;
    //             this.formGroupService.newFormGroup(this.form);
    //           });
    //         });
    //       } else {
    //         form.status.push({
    //           value: 'submitted',
    //           usersAllowed: [this.databaseService.activeUser.getValue().getName()],
    //           rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
    //           date: moment().format(),
    //           message: '',
    //           username: this.databaseService.activeUser.getValue().getName()
    //         });
    //         var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    //         if (
    //           id[3] !==
    //           form.tabs[0].sections[0].rows[0].columns[0].questions[0].input
    //         ) {
    //           this.databaseService.deleteForm(this.formID).then(doc => {
    //             this.submitted = doc;
    //             this.openDialog(false);
    //             this.databaseService.saveForm(form).then(doc => {
    //               this.submitted = doc;
    //               this.formID = doc.id;
    //               this.openDialog(false);
    //               this.databaseService
    //                 .getSubmittedForm(this.formID, form.os)
    //                 .then(form => {
    //                   this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;;
    //                   this.formRev = form._rev;
    //                   this.formGroupService.newFormGroup(this.form);
    //                 });
    //             });
    //           });
    //         } else {
    //           this.databaseService.editSubForm(form, this.formID, form.os).then(doc => {
    //             this.submitted = doc;
    //             this.openDialog(false);
    //             this.databaseService.getSubmittedForm(this.formID, form.os).then(form => {
    //               this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;;
    //               this.formRev = form._rev;
    //               this.formGroupService.newFormGroup(this.form);
    //             });
    //           });
    //         }
    //       }
    //     });
    //     this.openDialog(false);
    //   }
    // });
  }

  makeAvailableToOS() {
    let form = this.formGroupService.formGroupBS.getValue().getRawValue();
    const visitDateIndex = this.formGroupService.indexQuestionGroup(form, "Visit Date");
    const visitDate = this.formGroupService.findFormPartByIndex(form, visitDateIndex).input;

    form = this.formGroupService.compress(form);
    form.status.push({
      value: "submitted",
      usersAllowed: [this.databaseService.activeUser.getValue().getName()],
      rolesAllowed: this.databaseService.activeUser.getValue().getRoles(),
      date: moment().format(),
      message: "",
      username: this.databaseService.activeUser.getValue().getName(),
    });
    //this._socket.makeRequest(this.databaseService.activeUser.getValue(), { _id: this.formID, _rev: this.formRev, form });
    var id = pouchCollate.parseIndexableString(decodeURI(this.formID));
    if (id[3] !== visitDate) {
      this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.saveForm(form, form.os).then((doc) => {
          this.submitted = doc;
          this.formID = doc.id;
          //this.openDialog(false);
          this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
            this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
            this.formRev = form._rev;
            // this.formGroupService.newFormGroup(this.form, false);
            this.router.navigate(["/home"], this.returnNavExtras);
          });
        });
      });
    } else {
      this.databaseService.editSubForm(form, this.formID, form.os).then((doc) => {
        this.submitted = doc;
        //this.openDialog(false);
        this.databaseService.getSubmittedForm(this.formID, form.os).then((form) => {
          this.form = this.isCompressed(form.form) ? this.formGroupService.expand(this.templateForm.form, form.form) : form.form;
          this.formRev = form._rev;
          // this.formGroupService.newFormGroup(this.form, false);
          this.router.navigate(["/home"], this.returnNavExtras);
        });
      });
    }
  }
  delete() {
    const form = this.formGroupService.formGroupBS.getValue().getRawValue();
    this.databaseService.deleteForm(this.formID, form.os).then((doc) => {
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
        this.router.navigate(["/home"]);
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
          case "save":
            //this.save();
            this.transitionForm(this.curStatus);
            break;
          case "queueup":
            this.accept();
            break;
          case "lock":
            //this.saveToPool();
            this.transitionForm("reviewer pool");
            break;
          case "unlock":
            //this.makeAvailableToOS();
            this.transitionForm("submitted");
            break;
          case "startreview":
            //this.startReview();
            this.transitionForm("under review");
            break;
          case "sendbacktoos":
            //this.sendBackToOS();
            this.transitionForm("action required");
            break;
        }
        this.snackBar.open(successMsg, "Close", { duration: 2000 });
      } else {
        this.snackBar.open(dismassMsg, "Close", { duration: 2000 });
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

  reviewerIsCorrectReviewer(status) {
    const username = this.databaseService.activeUser.getValue().getName();

    if (status.value === "under review" || status.value === "reviewer pool" || status.value === "queued") {
      return status.username === username;
    }
    return true;
  }
  isCompressed(form) {
    return form.contents ? true : false;
  }
}
