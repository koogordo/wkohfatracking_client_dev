import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef } from "@angular/core";
import { DatabaseService } from "../_services/database.service";
import { Form } from "../_models/form";
import { MatSort, MatTableDataSource, Sort } from "@angular/material";
import { MatExpansionModule } from "@angular/material/expansion";
import { Router, ActivatedRoute } from "@angular/router";
declare var require: any;
var pouchCollate = require("pouchdb-collate");
import * as $PouchDB from "pouchdb";
const PouchDB = $PouchDB["default"];
import * as moment from "moment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NamePipe } from "../_pipes/name.pipe";
import { stringToKeyValue } from "@angular/flex-layout/extended/typings/style/style-transforms";
import { query } from "@angular/animations";
import { routerNgProbeToken } from "@angular/router/src/router_module";
var pouchCollate = require("pouchdb-collate");
import ElevatedCredentials from "../../config/elevate-permissions.config";
import { FormGroupService } from "../_services/form-group-service.service";
import { ClientSocketService } from "../_services/client-socket.service";
import { IWKONotification } from "../_services/WKOCommunication";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  @ViewChild(MatSort)
  @Output()
  goToFormClicked = new EventEmitter<any>();
  sort: MatSort;
  roles;
  submittedForms;
  childBlankForms: any[];
  adultBlankForms: any[];
  blankForms;
  clientFamilies;
  isAdmin;
  isOS;
  isReviewer;
  actionRequired = true;
  actionStatuses;
  familyContext;
  osContext;
  familyOfReviewedOSContext;
  familyMap = new Map<string, any>();
  formMap;
  familyNotFound;
  dataSource: MatTableDataSource<Form> = new MatTableDataSource<Form>(this.submittedForms);
  displayedColumns;
  reviewerOSes;
  returnFamilyID;
  returnOSName;
  filteredFamilies;
  _userDb;
  searchForm = new FormGroup({
    query: new FormControl(""),
  });
  constructor(private databaseService: DatabaseService, private router: Router, private route: ActivatedRoute, private _fg: FormGroupService, private _socket: ClientSocketService) {}
  ngOnInit() {
    this.familyNotFound = false;
    // console.log('home ng on init');

    this.databaseService.activeUser.subscribe((activeUser) => {
      if (activeUser) {
        this.roles = activeUser.getRoles();
        this.isAdmin = this.roles.indexOf("_admin") >= 0 ? true : false;
        this.isOS = this.roles.indexOf("OS") >= 0 ? true : false;
        this.isReviewer = this.roles.indexOf("REVIEWER") >= 0 ? true : false;
        if (this.isAdmin) {
          this.router.navigate(["admin"]);
        }
        if (this.isOS) {
          // console.log('in the os block');

          this.route.queryParams.subscribe((queryParams) => {
            this.databaseService.getFamiliesWithForms().then((families) => {
              this.clientFamilies = families;
              this.clientFamilies.sort((a, b) => {
                return a.familyID - b.familyID;
              });
              this.filteredFamilies = this.clientFamilies;
              console.log(this.clientFamilies);
              this.mapFamilies(this.clientFamilies);
              if (queryParams.returnFamily) {
                const index = this.clientFamilies
                  .map((family) => {
                    return family.familyID;
                  })
                  .indexOf(queryParams.returnFamily);
                this.familyContext = this.clientFamilies[index];
              } else {
                this.router.navigate(["/home"], { queryParams: { returnFamily: this.clientFamilies[0].familyID } });
              }
              if (this.blankForms) {
                this.setAllowedClients(JSON.parse(JSON.stringify(families)));
              }
            });
          });
        }
        if (this.isReviewer) {
          var login = this.databaseService.activeUser.getValue();
          this._userDb = new PouchDB(`https://${ElevatedCredentials.username}:${ElevatedCredentials.password}@www.hfatracking.net/couchdb/_users`);
          activeUser
            .getRemoteUserDB()
            .getUser(activeUser.getName())
            .then((result) => {
              var reviewGroup = result.reviewGroup || "R1";
              var reviewerGroupsDB = activeUser.getRemoteReviewGroupsDB();
              // return reviewerGroupsDB
              //   .allDocs({ include_docs: true, keys: [reviewGroup] })
              //   .then((res) => {
              //     var uniqueOS = [];
              //     res = res.rows.map((row) => {
              //       return {
              //         reviewGroup: row.id,
              //         reviewees: row.doc.reviewees,
              //       };
              //     });
              console.log(reviewGroup);
              return this._userDb
                .query("_auth/userByReviewGroup", { include_docs: true, key: [reviewGroup || "R1"] })
                .then((payload) => {
                  const uniqueOS = [];

                  const payloadWithReviewersRemoved = payload.rows.filter((row) => {
                    return row.doc.roles.indexOf("REVIEWER") < 0;
                  });

                  const osUserNameArray = payloadWithReviewersRemoved.map((row) => {
                    return row.doc.name;
                  });
                  // res = res.rows.map((row) => {
                  //   return {
                  //     reviewGroup: row.id,
                  //     reviewees: row.doc.reviewees,
                  //   };
                  // });
                  console.log(osUserNameArray);
                  for (let osName of osUserNameArray) {
                    if (uniqueOS.indexOf(osName) < 0) {
                      uniqueOS.push(osName);
                    }
                  }

                  return uniqueOS;
                })
                .catch((err) => console.log(err));
            })
            .then((uniqueOS) => {
              for (let unique of uniqueOS) {
                var OSCount = 0;
                var reviewerOSes = [];

                var tempDB = new PouchDB("https://www.hfatracking.net/couchdb/" + unique.toLowerCase());

                this.databaseService
                  .getFamiliesWithForms(tempDB, true)
                  .then((families: any[]) => {
                    let needAction = [];

                    for (let family of families) {
                      for (let client of family.child) {
                        if (this.isActionRequiredRev(client)[0]) {
                          needAction = this.isActionRequiredRev(client);
                          break;
                        }
                      }
                      for (let client of family.adult) {
                        if (this.isActionRequiredRev(client)[0]) {
                          needAction = this.isActionRequiredRev(client);
                          break;
                        }
                      }
                    }

                    families.sort((a, b) => {
                      return a.familyID - b.familyID;
                    });
                    reviewerOSes.push({
                      OSUsername: unique,
                      families: families,
                      actionRequired: needAction,
                    });
                    reviewerOSes.sort((a, b) => {
                      return this.getOsNumber(a.OSUsername) - this.getOsNumber(b.OSUsername);
                    });
                    OSCount++;
                  })
                  .catch((err) => console.log(`home.component 105: ${err}`));
              }

              return new Promise((resolve, reject) => {
                (function wait() {
                  if (OSCount >= uniqueOS.length) {
                    return resolve(reviewerOSes);
                  }
                  setTimeout(wait, 30);
                })();
              });
            })
            .then((reviewerOsRes) => {
              this.reviewerOSes = reviewerOsRes;
              console.log(this.reviewerOSes);
              this.route.queryParams.subscribe((queryParams) => {
                if (queryParams.OS) {
                  const returnOSindex = this.reviewerOSes
                    .map((os) => {
                      return os.OSUsername;
                    })
                    .indexOf(queryParams.OS || "");

                  const returnFamilyIndex = this.reviewerOSes[returnOSindex].families
                    .map((family) => {
                      return family.familyID;
                    })
                    .indexOf(queryParams.returnFamily || "");
                  const tempOS = returnOSindex >= 0 ? this.reviewerOSes[returnOSindex] : this.reviewerOSes[0];
                  const tempFamily = returnFamilyIndex >= 0 ? tempOS.families[returnFamilyIndex] : tempOS.families[0];
                  // console.log(returnFamilyIndex);
                  // console.log(tempOS);
                  // console.log(tempFamily);

                  this.setOsTemplateCtx(tempOS, tempFamily);
                } else {
                  this.router.navigate(["/home"], { queryParams: { OS: this.reviewerOSes[0].OSUsername, returnFamily: this.reviewerOSes[0].families[0].familyID } });
                }
              });
            })
            .catch((err) => console.log(err));
        }
      } else {
        this.roles = [];
      }
    });
    this.databaseService.childForms.subscribe((forms) => {
      this.childBlankForms = forms;
      if (this.childBlankForms.length > 0) {
        this.mapForms(this.childBlankForms);
      }
      //this.childBlankForms.splice(this.childBlankForms.map(form => form.form.name).indexOf('Child Visit'), 1);
    });
    this.databaseService.adultForms.subscribe((forms) => {
      this.adultBlankForms = forms;

      if (this.adultBlankForms.length > 0) {
        this.mapForms(this.adultBlankForms);
      }
      //this.adultBlankForms.splice(this.adultBlankForms.map(form => form.form.name).indexOf('Adult Visit'),1);
    });
    this.databaseService.forms.subscribe((forms) => {
      this.blankForms = forms;
      if (this.clientFamilies) {
        this.setAllowedClients(this.clientFamilies);
      }
    });
    this.listenForNotifications();
  }
  setAllowedClients(families) {
    const allClients = [];
    for (let index in this.blankForms) {
      this.blankForms[index].allowedClients = this.databaseService.getAllowedClientsForForm(this.blankForms[index].form, families);
    }
  }

  goToForm(form, OS = null, queryParams) {
    if (OS) {
      this.router.navigate(["/revViewForm", form._id], {
        queryParams,
      });
    } else {
      this.router.navigate(["/viewForm", form._id], {
        queryParams,
      });
    }
  }

  sortData(sort: Sort) {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (filter == "0") {
        return true;
      } else {
        return data.client == filter;
      }
    };
    this.dataSource.filter = filterValue;
  }

  getSubmittedFormTitle(form) {
    var id = pouchCollate.parseIndexableString(decodeURI(form._id));
    var visitDate = id[3];

    return moment(id[3]).format("DD MMM YYYY") + " - " + form.form.name + " - Status: " + form.form.status[form.form.status.length - 1].value;
  }

  getFormDate(form) {
    var id = pouchCollate.parseIndexableString(decodeURI(form._id));
    let date;
    if (form.form.contents) {
      const temp = form.form.contents.filter((questionContent) => {
        return questionContent.key === "Visit Date";
      })[0];
      date = temp.value;
    } else {
      const index = this._fg.indexQuestionGroup(form.form, "Visit Date");
      const fg = this._fg.findFormPartByIndex(form.form, index);
      date = fg.input;
    }

    return moment(date).format("DD MMM YYYY");
  }

  statusIconOS = {
    open: {
      icon: ["fas", "edit"],
      color: "blue",
      text: "Open for Editing",
    },
    submitted: {
      icon: ["fas", "unlock-alt"],
      color: "orange",
      text: "Submitted for Review",
    },
    "action required": {
      icon: ["fas", "exclamation-triangle"],
      color: "red",
      text: "Action Required",
    },
    "reviewer pool": {
      icon: ["fas", "lock"],
      color: "orange",
      text: "In Review",
    },
    "under review": {
      icon: ["fas", "circle"],
      color: "orange",
      text: "In Review",
    },
    queued: {
      icon: ["fas", "check-circle"],
      color: "green",
      text: "Approved - queued for dbase",
    },
    permanent: {
      icon: ["fas", "ban"],
      color: "purple",
      text: "Permanent - no longer editable",
    },
  };

  statusIconRev = {
    submitted: {
      icon: ["fas", "unlock-alt"],
      color: "orange",
      text: "Submitted for Review",
    },
    "action required": {
      icon: ["fas", "exclamation-triangle"],
      color: "red",
      text: "Action Required",
    },
    "reviewer pool": {
      icon: ["fas", "lock"],
      color: "orange",
      text: "In Review Pool",
    },
    "under review": {
      icon: ["fas", "circle"],
      color: "orange",
      text: "Being Reviewed",
    },
    queued: {
      icon: ["fas", "check-circle"],
      color: "green",
      text: "Approved - queued for dbase",
    },
    permanent: {
      icon: ["fas", "ban"],
      color: "purple",
      text: "Permanent - no longer editable",
    },
  };

  openContactLog(familyID) {
    // console.log('openContactLog(', familyID, ')');
  }

  addChild(familyID) {
    // console.log('addChild(', familyID, ')');
  }

  addParent(familyID) {
    // console.log('addParent(', familyID, ')');
  }

  deleteForm(formID) {
    // console.log('deleteForm(', formID, ')');
    this.databaseService.deleteForm(formID).then((doc) => {
      this.databaseService.getFamiliesWithForms().then((families) => {
        this.clientFamilies = families;
        if (this.blankForms) {
          this.setAllowedClients(JSON.parse(JSON.stringify(families)));
        }
      });
    });
  }

  statusMessage() {}

  isActionRequiredRev(client) {
    let formStatuses = [];
    client.forms.CompleteForms.map((form) => {
      formStatuses.push(form.form.status[form.form.status.length - 1]);
    });
    client.forms.TransitionForms.map((form) => {
      formStatuses.push(form.form.status[form.form.status.length - 1]);
    });
    client.forms.ReviewForms.map((form) => {
      formStatuses.push(form.form.status[form.form.status.length - 1]);
    });
    return formStatuses.length > 0 ? [true, formStatuses] : [false, null];
  }

  isActionRequiredOS(client) {
    let formStatuses = [];
    client.forms.ActiveForms.map((form) => {
      formStatuses.push(form.form.status[form.form.status.length - 1]);
    });
    client.forms.LockedForms.map((form) => {
      formStatuses.push(form.form.status[form.form.status.length - 1]);
    });
    client.forms.TransitionForms.map((form) => {
      formStatuses.push(form.form.status[form.form.status.length - 1]);
    });
    return formStatuses.length > 0 ? [true, formStatuses] : [false, null];
  }
  familyHasActiveForms(family): boolean {
    if (this.isOS) {
      for (const adult of family.adult) {
        if (this.isActionRequiredOS(adult)[0]) {
          // console.log(this.isActionRequiredOS(adult)[0]);
          return true;
        }
      }
      for (const child of family.child) {
        if (this.isActionRequiredOS(child)[0]) {
          // console.log(this.isActionRequiredOS(child)[0]);
          return true;
        }
      }
    } else if (this.isReviewer) {
      for (const adult of family.adult) {
        if (this.isActionRequiredRev(adult)[0]) {
          // console.log(this.isActionRequiredRev(adult)[0]);
          return true;
        }
      }
      for (const child of family.child) {
        if (this.isActionRequiredRev(child)[0]) {
          // console.log(this.isActionRequiredRev(child)[0]);
          return true;
        }
      }
    }
    return false;
  }
  setFamilyTemplateCtx(family) {
    this.familyContext = family;
    const user = this.databaseService.activeUser.getValue();
    user.setSavedFamilyContext(this.familyContext);
    this.databaseService.activeUser.next(user);
  }
  setOsTemplateCtx(os, family) {
    this.osContext = os;
    this.clientFamilies = this.osContext.families;
    this.filteredFamilies = this.clientFamilies;
    this.mapFamilies(this.osContext.families);
    this.familyOfReviewedOSContext = family;
  }

  searchForFamily() {
    const key = this.toFamilySearchKey(this.searchForm.controls.query.value);
    if (this.familyMap.has(key)) {
      if (this.isOS) {
        this.router.navigate(["/home"], { queryParams: { returnFamily: this.familyMap.get(key).familyID } });
      } else if (this.isReviewer) {
        this.router.navigate(["/home"], { queryParams: { OS: this.osContext.OSUsername, returnFamily: this.familyMap.get(key).familyID } });
      }
      this.searchForm.reset();
    } else {
      this.familyNotFound = true;
      setTimeout(() => {
        this.familyNotFound = false;
      }, 3000);
    }
  }

  mapFamilies(clientFamilies) {
    this.familyMap = null;
    this.familyMap = new Map<string, any>();
    for (let family of clientFamilies) {
      const key = this.toFamilySearchKey(family.clientFName.toLowerCase() + family.clientLName.toLowerCase());
      if (!this.familyMap.has(key)) {
        this.familyMap.set(key, family);
      }
    }
  }

  toFamilySearchKey(rawKey) {
    return rawKey
      .toLowerCase()
      .split(" ")
      .join("");
  }

  mapForms(forms) {
    if (!this.formMap) {
      this.formMap = new Map<string, any>();
    }
    for (let form of forms) {
      const key = pouchCollate.parseIndexableString(decodeURI(form._id))[1];
      if (!this.formMap.has(key)) {
        this.formMap.set(key, form);
      }
    }
  }

  reviewerIsCorrectReviewer(status) {
    const username = this.databaseService.activeUser.getValue().getName();
    return status.username === username;
  }

  getOsNumber(username: string) {
    const number = Number.parseInt(username.slice(2, username.length));
    return number;
  }

  checkForTerminationForm(client) {
    const lockedForms: any[] = client.forms.LockedForms;
    const allForms = lockedForms.concat(client.forms.TransitionForms);
    for (const form of allForms) {
      if (form.form.name === "Termination Form") {
        return true;
      }
    }
    return false;
  }

  filterFamilies() {
    const filter = this.toFamilySearchKey(this.searchForm.controls.query.value);
    if (filter !== "") {
      this.filteredFamilies = this.clientFamilies.filter((family) => {
        return this.compareFamilyToFilter(this.toFamilySearchKey(family.clientFName), filter) || this.compareFamilyToFilter(this.toFamilySearchKey(family.clientLName), filter);
      });
    } else {
      this.filteredFamilies = this.clientFamilies;
    }
  }

  private compareFamilyToFilter(familyKey: any, filter: string) {
    const filterArr = filter.split("");
    const familyKeyArr = familyKey.split("");
    for (let i = 0; i < filter.split("").length; i++) {
      if (filterArr[i] !== familyKeyArr[i]) {
        return false;
      }
    }
    return true;
  }

  private listenForNotifications() {
    this._socket.notifications().subscribe((data: IWKONotification) => {
      console.log(data);
      if (data) {
        this.handleNotification(data);
      }
    });
  }

  private handleNotification(data: IWKONotification) {
    const user = this.databaseService.activeUser.getValue();
    const isOS = user.getRoles().indexOf("OS") >= 0 ? true : false;
    const isReviewer = user.getRoles().indexOf("REVIEWER") >= 0 ? true : false;
    if (isOS) {
      console.log("Handle notification os: ", data);
      this.makeOsNotifyChanges(data);
    } else if (isReviewer) {
      console.log("Handle notification reviewer: ", data);
      this.makeReviewerNotifyChanges(data);
    }
  }

  private makeReviewerNotifyChanges(data: IWKONotification) {
    const changeToForm = data.newForm;
    console.log(`findClientInReviewer(${data.changedBy.split(":")[1]}, ${changeToForm.form.client})`);
    const client = this.findClientInReviewer(data.changedBy.split(":")[1], changeToForm.form.client);

    if (client) {
      const allForms = client.forms.TransitionForms.concat(client.forms.ReviewForms.concat(client.forms.CompleteForms));
      console.log(allForms);
      const oldStatus = this.getOldFormStatus(allForms, data.newForm._id);
      const newStatus = data.newForm.form.status[data.newForm.form.status.length - 1].value;
      this.deleteOldForm(client, oldStatus, data.newForm._id, "fromReviewer");
      this.addNewForm(client, newStatus, data.newForm, "fromReviewer");
    }
  }

  private makeOsNotifyChanges(data: IWKONotification) {
    const changeToForm = data.newForm;
    const client = this.findClientInOs(changeToForm.form.client);

    if (client) {
      const allForms = client.forms.TransitionForms.concat(client.forms.ActiveForms.concat(client.forms.LockedForms));
      console.log(allForms);
      const oldStatus = this.getOldFormStatus(allForms, data.newForm._id);
      const newStatus = data.newForm.form.status[data.newForm.form.status.length - 1].value;
      this.deleteOldForm(client, oldStatus, data.newForm._id, "fromOS");
      this.addNewForm(client, newStatus, data.newForm, "fromOS");
    }
  }

  private getOldFormStatus(forms, changeToForm) {
    for (let i in forms) {
      console.log(changeToForm._id, forms[i]._id);
      if (changeToForm === forms[i]._id) {
        return forms[i].form.status[forms[i].form.status.length - 1].value;
      }
    }
    return null;
  }

  private deleteOldForm(client, oldStatus, id, who) {
    let statuses;
    let caseZeroForms;
    let caseOneForms;
    let caseTwoForms;
    let caseThreeForms;
    let caseFourForms;
    if (who === "fromReviewer") {
      statuses = {
        open: 0,
        "action required": 1,
        permanent: 3,
        queued: 2,
        "reviewer pool": 2,
        "under review": 2,
        submitted: 1,
      };
      caseZeroForms = null;
      caseOneForms = client.forms.TransitionForms;
      caseTwoForms = client.forms.ReviewForms;
      caseThreeForms = client.forms.CompleteForms;
      caseFourForms = null;
    } else {
      statuses = {
        open: 0,
        "action required": 1,
        permanent: 4,
        queued: 3,
        "reviewer pool": 2,
        "under review": 2,
        submitted: 1,
      };

      caseZeroForms = client.forms.ActiveForms;
      caseOneForms = client.forms.TransitionForms;
      caseTwoForms = client.forms.LockedForms;
      caseThreeForms = client.forms.LockedForms;
      caseFourForms = client.forms.LockedForms;
    }
    console.log(oldStatus);
    console.log(caseThreeForms);
    if (oldStatus) {
      switch (statuses[oldStatus]) {
        case 0: {
          const deleteIndex = caseZeroForms
            .map((form) => {
              return form._id;
            })
            .indexOf(id);
          if (deleteIndex >= 0) {
            console.log("delete case zero form");
            caseZeroForms.splice(deleteIndex, 1);
          }
          break;
        }
        case 1: {
          const deleteIndex = caseOneForms
            .map((form) => {
              return form._id;
            })
            .indexOf(id);
          if (deleteIndex >= 0) {
            console.log("delete case one form");
            caseOneForms.splice(deleteIndex, 1);
          }
          break;
        }
        case 2: {
          const deleteIndex = caseTwoForms
            .map((form) => {
              return form._id;
            })
            .indexOf(id);
          if (deleteIndex >= 0) {
            console.log("delete case two form");
            caseTwoForms.splice(deleteIndex, 1);
          }
          break;
        }
        case 3: {
          const deleteIndex = caseThreeForms
            .map((form) => {
              return form._id;
            })
            .indexOf(id);
          if (deleteIndex >= 0) {
            console.log("delete case three form");
            caseThreeForms.splice(deleteIndex, 1);
          }
          break;
        }
        case 4: {
          const deleteIndex = caseFourForms
            .map((form) => {
              return form._id;
            })
            .indexOf(id);
          if (deleteIndex >= 0) {
            console.log("delete case four form");
            caseFourForms.splice(deleteIndex, 1);
          }
          break;
        }
      }
    }
  }

  addNewForm(client, newStatus, newForm, who) {
    let statuses;
    let caseZeroForms;
    let caseOneForms;
    let caseTwoForms;
    let caseThreeForms;
    let caseFourForms;
    if (who === "fromReviewer") {
      statuses = {
        open: 0,
        "action required": 1,
        permanent: 3,
        queued: 2,
        "reviewer pool": 2,
        "under review": 2,
        submitted: 1,
      };
      caseZeroForms = null;
      caseOneForms = client.forms.TransitionForms;
      caseTwoForms = client.forms.ReviewForms;
      caseThreeForms = client.forms.CompleteForms;
      caseFourForms = null;
    } else {
      statuses = {
        open: 0,
        "action required": 1,
        permanent: 4,
        queued: 3,
        "reviewer pool": 2,
        "under review": 2,
        submitted: 1,
      };

      caseZeroForms = client.forms.ActiveForms;
      caseOneForms = client.forms.TransitionForms;
      caseTwoForms = client.forms.LockedForms;
      caseThreeForms = client.forms.LockedForms;
      caseFourForms = client.forms.LockedForms;
    }
    if (newStatus) {
      switch (statuses[newStatus]) {
        case 0: {
          caseZeroForms.push(newForm);
          break;
        }
        case 1: {
          caseOneForms.push(newForm);
          break;
        }
        case 2: {
          caseTwoForms.push(newForm);
          break;
        }
        case 3: {
          caseThreeForms.push(newForm);
          break;
        }
        case 4: {
          caseFourForms.push(newForm);
          break;
        }
      }
    }
  }

  // private updateReviewerOs(os, changeToForm) {
  //   for (let i in os.families) {
  //     this.updateFamilyAdult(os.families[i].adult, changeToForm);
  //     this.updateFamilyChild(os.families[i].child, changeToForm);
  //   }
  // }

  // private updateFamilyAdult(adult, changeToForm) {
  //   for (let i in adult) {
  //     this.updateFamilyForm(adult[i].forms.ActiveForms || adult[i].forms.ReviewForms, changeToForm);
  //     this.updateFamilyForm(adult[i].forms.TransitionForms, changeToForm);
  //     this.updateFamilyForm(adult[i].forms.LockedForms || adult[i].forms.CompleteForms, changeToForm);
  //   }
  // }

  // private updateFamilyChild(child, changeToForm) {
  //   for (let i in child) {
  //     this.updateFamilyForm(child[i].forms.ActiveForms || child[i].forms.ReviewForms, changeToForm);
  //     this.updateFamilyForm(child[i].forms.TransitionForms, changeToForm);
  //     this.updateFamilyForm(child[i].forms.LockedForms || child[i].forms.CompleteForms, changeToForm);
  //   }
  // }

  // private updateFamilyForm(forms, changeToForm) {
  //   let formExistedPreviously = false;
  //   for (let i in forms) {
  //     if (changeToForm._id === forms[i]._id) {
  //       console.log("OLD FORM: ", forms[i]);
  //       console.log("NEW FORM: ", changeToForm);
  //       forms[i] = changeToForm;
  //       formExistedPreviously = true;
  //       break;
  //     }
  //   }
  // }

  private findClientInOs(id) {
    const parsedID = pouchCollate.parseIndexableString(decodeURI(id));
    for (let i in this.clientFamilies) {
      if (this.clientFamilies[i].familyID === parsedID[0]) {
        return this.clientFamilies[i][parsedID[1]][parsedID[2]];
      }
    }
    return null;
  }

  private findClientInReviewer(os, id) {
    const parsedID = pouchCollate.parseIndexableString(decodeURI(id));
    for (let i in this.reviewerOSes) {
      if (this.reviewerOSes[i].OSUsername === os) {
        for (let j in this.reviewerOSes[i].families) {
          console.log(this.reviewerOSes[i].families[j]);
          if (this.reviewerOSes[i].families[j].familyID === parsedID[0]) {
            return this.reviewerOSes[i].families[j][parsedID[1]][parsedID[2]];
          }
        }
      }
    }
    return null;
  }
}
