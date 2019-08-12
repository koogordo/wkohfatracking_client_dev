import { Injectable } from "@angular/core";
import { Form } from "../_models/form";
declare var require: any;
import * as $PouchDB from "pouchdb";
const PouchDB = $PouchDB["default"];
var pouchCollate = require("pouchdb-collate");

import { CookieService } from "ngx-cookie-service";

import * as moment from "moment";
import { ConnectionService } from "../_services/connection.service";
import { Subject, BehaviorSubject } from "rxjs/";

import { User } from "../_types/user";
import { FormGroupService } from "./form-group-service.service";
import ElevatedCredentials from "../../config/elevate-permissions.config";
import { Router } from "@angular/router";
import { ClientSocketService } from "./client-socket.service";

@Injectable()
export class DatabaseService {
  private _userDb: any;
  private localUserDB: any;
  private remoteUserDB: any;

  private localFormsDB: any;
  private remoteFormsDB: any;

  private localFamiliesDB: any;
  private remoteFamiliesDB: any;
  online: boolean;
  activeUser = new BehaviorSubject<User>(null);
  forms = new BehaviorSubject<any[]>([]);

  childForms = new BehaviorSubject<any[]>([]);
  adultForms = new BehaviorSubject<any[]>([]);
  subForms = new BehaviorSubject<any[]>([]);
  allFormsMap = new Map();
  constructor(private cookieService: CookieService, private connectionService: ConnectionService, private _fg: FormGroupService, private router: Router, private _socket: ClientSocketService) {
    this.activeUser.subscribe((res) => {
      this.connectionService.connection().subscribe((connection) => {
        this.online = connection;
        if (res && this.online) {
          this.localFormsDB = res.getLocalFormsDB();
          this.localUserDB = res.getLocalUserDB();
          this.localFamiliesDB = res.getLocalFamiliesDB();
          if (this.online) {
            this.remoteFormsDB = res.getRemoteFormsDB();
            this.remoteUserDB = res.getRemoteUserDB();
            this.remoteFamiliesDB = res.getRemoteFamiliesDB();
          }

          this.updateForms();
          this.updateSubForms();
          this.getForms().then((forms) => {
            forms.forEach((form) => {
              if (!this.allFormsMap.has(form.form.name)) {
                this.allFormsMap.set(form.form.name, form.form);
              }
            });
          });
          // this.updateFamilies();
        } else {
          this.localFormsDB = null;
          this.localUserDB = null;
          this.localFamiliesDB = null;
          this.remoteUserDB = null;
          this.remoteFormsDB = null;
          this.remoteFamiliesDB = null;
        }
      });
    });
  }

  getPrevForm(formID, clientID = null, date = null): Promise<any> {
    formID = this.parseID(formID);
    let formName;
    if (formID[0] === "blankForm") {
      formName = formID[1];
    } else {
      formName = formID[4];
    }
    if (!date) {
      date = formID[3];
    }
    //this could potentially cause problems in the case of previewing an edited form which also doesn't submit a clientID when calling this function.  It doesn't cause issues currently because the OSDB does not have any forms that start with "54blankform..." but would if it does in the future.
    if (!clientID) {
      clientID = this.toID([formID[0], formID[1], formID[2]]).slice(0, -3);
    } else {
      clientID = clientID.slice(0, -3);
    }
    return this.localUserDB
      .allDocs({
        include_docs: true,
        startkey: clientID,
        endkey: clientID + "\uffff",
      })
      .then((res) => {
        if (res.rows.length != 0) {
          const temp = res.rows
            .filter((row) => this.parseID(row.id)[4] === formName)
            .reduce((acc, cur) => {
              if (moment(this.parseID(cur.id)[3]).isAfter(moment(this.parseID(acc.id)[3])) && moment(this.parseID(cur.id)[3]).isBefore(moment(date))) {
                return cur;
              } else {
                return acc;
              }
            });

          return moment(this.parseID(temp.id)[3]).isSameOrAfter(moment(date)) ? null : temp.doc;
        } else {
          return null;
        }
      })
      .catch((err) => console.log(err));
  }

  parseID(ID: string) {
    return pouchCollate.parseIndexableString(decodeURI(ID));
  }
  toID(ID: string[]) {
    return encodeURI(pouchCollate.toIndexableString(ID));
  }
  setLogin(login) {
    this.activeUser.next(login);
  }

  setLogout() {
    let user = this.activeUser.getValue();
    if (this.online) {
      this._socket.getInstance().close();
      this.cookieService.delete("login");
      user
        .getRemoteUserDB()
        .logOut()
        .then((response) => {
          if (response) {
            this.activeUser.next(null);
            this.router.navigate(["/login"]);
          }
        });
    } else {
      this.cookieService.delete("login");
      this.activeUser.next(null);
      this.router.navigate(["/login"]);
    }
  }

  setLoginCookie(loginCookie: { username: String; password: string }) {
    const expiry = moment(Date.now()).add(30, "minutes");
    this.cookieService.set("login", JSON.stringify(loginCookie), expiry.toDate(), "/");
  }
  updateForms(forms?: Form[]) {
    //this.localFormsDB.sync(this.remoteFormsDB);
    if (typeof forms !== "undefined") {
      this.forms.next(forms);
    } else {
      this.getForms().then((forms) => {
        this.forms.next(forms);
        // if (this.online) {
        //   this.localFormsDB
        //     .sync(this.remoteFormsDB)
        //     .on('complete', function() {
        //       // yay, we're in sync!
        //       console.log('Now in sync with remote forms db');
        //     })
        //     .on('error', function(err) {
        //       // boo, we hit an error!
        //       console.error('Remote db sync fail');
        //     });
        // }
        this.getFormsForClientType("child").then((forms) => {
          this.childForms.next(forms);
        });
        this.getFormsForClientType("adult").then((forms) => {
          this.adultForms.next(forms);
        });
      });
    }
  }

  updateSubForms(forms?: Form[]) {
    //this.localUserDB.sync(this.remoteUserDB);
    if (typeof forms !== "undefined") {
      this.subForms.next(forms);
    } else {
      this.getSubmittedForms().then((forms) => {
        this.subForms.next(forms);
        // if (this.online) {
        //   this.localUserDB
        //     .sync(this.remoteUserDB)
        //     .on('complete', function(res) {
        //       // yay, we're in sync!
        //     })
        //     .on('error', function(err) {
        //       console.error(err);
        //       // boo, we hit an error!
        //     });
        // }
      });
    }
  }
  putFamily(family) {
    // console.log(family);
    let db;
    if (this.online) {
      db = this.remoteFamiliesDB;
    } else {
      throw new Error("Cannot update family while you are offline.");
    }
    return db.put(family).then((res) => {
      // this.updateFamilies();
      return res;
    });
  }

  addNewFamily(form) {
    let userdb;
    let familiesdb;
    if (this.online) {
      userdb = this.remoteUserDB;
      familiesdb = this.remoteFamiliesDB;
    } else {
      userdb = this.localUserDB;
      familiesdb = this.localFamiliesDB;
    }

    const newFamily = {
      _id: form.tabs[0].sections[0].rows[2].columns[0].questions[0].input,
      primaryFName: form.tabs[0].sections[0].rows[1].columns[0].questions[0].input,
      primaryLName: form.tabs[0].sections[0].rows[1].columns[1].questions[0].input,
      dateJoined: form.tabs[0].sections[0].rows[0].columns[0].questions[0].input,
      child: [],
      adult: [],
      form,
    };

    return userdb.get("clients").then((clientDoc) => {
      clientDoc.clients.push({ familyID: newFamily._id });
      return userdb.put(clientDoc).then((res) => {
        if (res) {
          return familiesdb.put(newFamily).then((res) => {
            return res;
          });
        }
      });
    });
  }
  // updateFamilies() {
  //   if (this.online) {
  //     //console.log('update');
  //     // console.log(this.localFamiliesDB);
  //     //console.log(this.remoteFamiliesDB);
  //     this.remoteFamiliesDB.get
  //   }
  // }

  getForm(id: string): Promise<any> {
    let db;
    if (this.online) {
      db = this.remoteFormsDB;
    } else {
      db = this.localFormsDB;
    }
    return db.get(id).then((result) => {
      return result;
    });
  }
  getSubmittedForm(id: string, OSDB = null): Promise<any> {
    var db;
    if (OSDB) {
      if (!this.online) {
        throw new Error(`Attempted to delete form: ${id} from remote database while offline, try again when connected to internet.`);
      }
      db = new PouchDB("https://www.hfatracking.net/couchdb/" + OSDB.toLowerCase());
    } else if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }
    return db
      .get(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }
  getSubmittedForms(): Promise<any[]> {
    let db;
    if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }
    var promise = db
      .allDocs({
        include_docs: true,
        startkey: "submit:",
        endkey: "submit:\uffff",
      })
      .then((res) => {
        var forms = res.rows.map((row) => {
          return row.doc;
        });
        return forms;
      });
    return promise;
  }

  getFormsForClientType(type: string): Promise<any[]> {
    let db;
    if (this.online) {
      db = this.remoteFormsDB;
    } else {
      db = this.localFormsDB;
    }
    var promise = db
      .allDocs({
        include_docs: true,
        startkey: "54blankForm",
        endkey: "54blankForm:\uffff",
      })
      .then((res) => {
        var forms = res.rows.map((row) => {
          return row.doc;
        });
        return forms.filter((res) => {
          return res.form.allowedClientTypes.indexOf(type) >= 0;
        });
      });
    return promise;
  }
  getForms(): Promise<any[]> {
    let db;
    if (this.online) {
      db = this.remoteFormsDB;
    } else {
      db = this.localFormsDB;
    }
    return db
      .allDocs({
        include_docs: true,
        startkey: "54blankForm",
        endkey: "54blankForm:\uffff",
      })
      .then((res) => {
        var forms = res.rows.map((row) => {
          return row.doc;
        });

        return forms;
      })
      .catch((err) => console.error(`Database service 492: ${err}`));
  }
  getClientFamilyIDs(remoteDB = null): Promise<any[]> {
    var db;
    if (remoteDB) {
      db = remoteDB;
    } else if (this.online) {
      db = this.remoteUserDB;
    } else {
      throw new Error("Can't get family IDs for the client while offline");
    }

    return db
      .get("clients")
      .then((res) => {
        return res.clients.map((client) => {
          return client.familyID;
        });
      })
      .catch((err) => console.error(`database.service line 503: ${err}`));
  }
  getAllowedClientsForForm(form, families) {
    var allowedClients = [];
    if (form.allowedClientTypes.indexOf("child") >= 0) {
      for (let family of families) {
        for (let child in family.child) {
          allowedClients.push({
            clientFName: family.child[child].clientFName,
            clientLName: family.child[child].clientLName,
            clientID: pouchCollate.toIndexableString([family.familyID, "child", child]),
          });
        }
      }
    }
    if (form.allowedClientTypes.indexOf("adult") >= 0) {
      for (let family of families) {
        for (let adult in family.adult) {
          allowedClients.push({
            clientFName: family.adult[adult].clientFName,
            clientLName: family.adult[adult].clientLName,
            clientID: pouchCollate.toIndexableString([family.familyID, "adult", adult]),
          });
        }
      }
    }
    return allowedClients;
  }
  getFamily(familyID): Promise<any> {
    let db;
    if (this.online) {
      db = this.remoteFamiliesDB;
    } else {
      throw new Error("Can't retrieve families while offline");
    }
    return db.get(familyID);
  }

  getAvailableForms(clientID): Promise<any[]> {
    return this.getForms();
  }
  getFamiliesWithoutForms() {
    var behaviorSubject = new BehaviorSubject<any[]>([]);

    this.getClientFamilyIDs().then((familyIDs) => {
      var families = [];

      for (let familyID of familyIDs) {
        this.getFamily(familyID).then((family) => {
          var adults = [];
          for (let adult in family.adult) {
            var temp = {
              clientFName: family.adult[adult]["clientFName"],
              clientLName: family.adult[adult]["clientLName"],
            };
            adults.push(temp);
          }
          var children = [];
          for (let child in family.child) {
            var temp = {
              clientFName: family.child[child]["clientFName"],
              clientLName: family.child[child]["clientLName"],
            };
            children.push(temp);
          }
          families.push({
            familyID: familyID,
            child: children,
            adult: adults,
          });
          behaviorSubject.next(families);
        });
      }
      return families;
    });
    return behaviorSubject;
  }

  getSubmittedFormsForClient(id, sortByCurStatus = false, remoteOSDB = null, reviewer = false) {
    var db;
    if (remoteOSDB) {
      if (!this.online) {
        throw new Error(`Attempted to delete form: ${id} from remote database while offline, try again when connected to internet.`);
      }
      db = remoteOSDB;
    } else if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }
    //encode and get rid of end of string chars ('%00', 3 characters)
    var encodedID = encodeURI(pouchCollate.toIndexableString(id));
    encodedID = encodedID.slice(0, encodedID.length - 3);

    var promise = db
      .allDocs({
        include_docs: true,
        startkey: encodedID + "\uffff",
        endkey: encodedID,
        descending: true,
      })
      .then((res) => {
        var forms = res.rows.map((row) => {
          return row.doc;
        });
        if (sortByCurStatus) {
          if (reviewer) {
            return this.sortFormsForReviewer(forms);
          } else {
            return this.sortFormsForOS(forms);
          }
        } else return forms;
      })
      .catch((err) => console.error(err));
    return promise;
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

  sortFormsForOS(forms) {
    const statuses = {
      open: 0,
      "action required": 1,
      permanent: 4,
      queued: 3,
      "reviewer pool": 2,
      "under review": 2,
      submitted: 1,
    };
    const actForms = forms.filter((form) => {
      return statuses[form.form.status[form.form.status.length - 1]["value"]] === 0;
    });
    const transForms = forms.filter((form) => {
      return statuses[form.form.status[form.form.status.length - 1]["value"]] === 1;
    });
    const lockedForms = forms.filter((form) => {
      return statuses[form.form.status[form.form.status.length - 1]["value"]] >= 2;
    });

    return {
      ActiveForms: actForms,
      TransitionForms: transForms,
      LockedForms: lockedForms,
    };
  }

  sortFormsForReviewer(forms) {
    const statuses = {
      open: 0,
      "action required": 1,
      permanent: 3,
      queued: 2,
      "reviewer pool": 2,
      "under review": 2,
      submitted: 1,
    };
    const transForms = forms.filter((form) => {
      return statuses[form.form.status[form.form.status.length - 1]["value"]] === 1;
    });
    const revForms = forms.filter((form) => {
      return statuses[form.form.status[form.form.status.length - 1]["value"]] === 2;
    });
    const completeForms = forms.filter((form) => {
      return statuses[form.form.status[form.form.status.length - 1]["value"]] === 3;
    });
    return {
      TransitionForms: transForms,
      ReviewForms: revForms,
      CompleteForms: completeForms,
    };
  }

  ///bad code fix with resolve/timeout stuff figured out at the end
  getFamiliesWithForms(remoteOSDB = null, reviewer = false) {
    const familyPromises = [];
    const adultPromises = [];
    const childPromises = [];
    return this.getClientFamilyIDs(remoteOSDB)
      .then((familyIDs) => {
        var famCount = 0;
        var families = [];
        for (let familyID of familyIDs) {
          familyPromises.push(
            this.getFamily(familyID)
              .then((family) => {
                // console.log(family);
                var adultCount = 0;
                var childCount = 0;
                var adults = [];
                var children = [];

                for (let adult in family.adult) {
                  var temp = {
                    clientFName: family.adult[adult]["clientFName"],
                    clientLName: family.adult[adult]["clientLName"],
                    clientType: "adult",
                    terminated: family.adult[adult].terminated !== undefined ? family.adult[adult].terminated : false,
                    clientID: family.adult[adult]["clientID"] || encodeURI(pouchCollate.toIndexableString([family._id, "adult", adult])),
                    forms: [],
                  };

                  adults.push(temp);

                  adultPromises.push(
                    this.getSubmittedFormsForClient([familyID, "adult", adult], true, remoteOSDB, reviewer)
                      .then((forms) => {
                        adults[adult].forms = forms;
                        if (reviewer) {
                          adults[adult].forms.TransitionForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          adults[adult].forms.ReviewForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          adults[adult].forms.CompleteForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          adults[adult].forms.TransitionForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          adults[adult].forms.ReviewForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          adults[adult].forms.CompleteForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                        } else {
                          adults[adult].forms.ActiveForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          adults[adult].forms.LockedForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          adults[adult].forms.TransitionForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          adults[adult].forms.ActiveForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          adults[adult].forms.LockedForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          adults[adult].forms.TransitionForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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

                        adultCount++;
                        if (adultCount >= family.adult.length && childCount >= family.child.length) {
                          families.push({
                            familyID: familyID,
                            child: children,
                            adult: adults,
                            clientFName: family.primaryFName ? family.primaryFName : family.adult[0].clientFName,
                            clientLName: family.primaryLName ? family.primaryLName : family.adult[0].clientLName,
                          });
                          famCount++;
                        }
                      })
                      .catch((err) => console.error(err))
                  );
                }
                for (let child in family.child) {
                  var temp = {
                    clientFName: family.child[child]["clientFName"],
                    clientLName: family.child[child]["clientLName"],
                    terminated: family.child[child].terminated !== undefined ? family.child[child].terminated : false,
                    clientType: "child",
                    clientID: family.child[child]["clientID"] || encodeURI(pouchCollate.toIndexableString([family._id, "child", child])),
                    forms: [],
                  };
                  children.push(temp);
                  childPromises.push(
                    this.getSubmittedFormsForClient([familyID, "child", child], true, remoteOSDB, reviewer)
                      .then((forms) => {
                        children[child].forms = forms;
                        if (reviewer) {
                          children[child].forms.TransitionForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          children[child].forms.ReviewForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          children[child].forms.CompleteForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          children[child].forms.TransitionForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          children[child].forms.ReviewForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          children[child].forms.CompleteForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                        } else {
                          children[child].forms.ActiveForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          children[child].forms.LockedForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          children[child].forms.TransitionForms.forEach((formDoc) => {
                            if (this._fg.isCompressed(formDoc.form)) {
                              formDoc.form = this._fg.expand(this.allFormsMap.get(formDoc.form.name), formDoc.form);
                            }
                          });
                          children[child].forms.ActiveForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          children[child].forms.LockedForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                          children[child].forms.TransitionForms.sort((a, b) => {
                            const aDate = this._fg.findFormPartByIndex(a.form, this._fg.indexQuestionGroup(a.form, "Visit Date")).input;
                            const bDate = this._fg.findFormPartByIndex(b.form, this._fg.indexQuestionGroup(b.form, "Visit Date")).input;
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
                        childCount++;
                        if (adultCount >= family.adult.length && childCount >= family.child.length) {
                          families.push({
                            familyID: familyID,
                            child: children,
                            adult: adults,
                            clientFName: family.primaryFName ? family.primaryFName : family.adult[0].clientFName,
                            clientLName: family.primaryLName ? family.primaryLName : family.adult[0].clientLName,
                          });
                          famCount++;
                        }
                      })
                      .catch((err) => console.log(err))
                  );
                }

                return Promise.all(adultPromises).then(() => {
                  return Promise.all(childPromises).then(() => {
                    if (family.adult.length === 0 && family.child.length === 0) {
                      families.push({
                        familyID: familyID,
                        adult: family.adult,
                        child: family.child,
                        clientFName: family.primaryFName ? family.primaryFName : family.adult[0].clientFName,
                        clientLName: family.primaryLName ? family.primaryLName : family.adult[0].clientLName,
                      });
                    }
                    return families;
                  });
                });
              })
              .catch((err) => console.log(err))
          );
        }
        // return new Promise((resolve, reject) => {
        //   (function wait() {
        //       console.log(families);
        //       return resolve(families);
        //     setTimeout(wait, 30);
        //   })();
        // });
        return Promise.all(familyPromises).then((families) => {
          return families[families.length - 1];
        });
      })
      .catch((err) => console.log(err));
  }
  newForm(form: Form): Promise<string> {
    form = JSON.parse(JSON.stringify(form));
    var id = pouchCollate.toIndexableString(["blankForm", form.name]);
    id = encodeURI(id);
    let db;
    if (this.online) {
      db = this.remoteFormsDB;
    } else {
      db = this.localFormsDB;
    }
    var promise = db
      .put({
        _id: id,
        form,
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
    this.updateForms();
    return promise;
  }

  editForm(form: Form, id: string): Promise<string> {
    form = JSON.parse(JSON.stringify(form));
    // console.log(form);
    // console.log(id);
    return this.remoteFormsDB
      .get(id)
      .then((doc) => {
        doc.form = form;
        // console.log(doc);
        return this.remoteFormsDB.put(doc);
      })
      .then((res) => {
        this.updateForms();
        return res;
      });
  }
  editSubForm(form: Form, subFormID: string, remoteDB = null): Promise<string> {
    let db;
    // console.log(remoteDB);
    if (remoteDB) {
      if (!this.online) {
        throw new Error(`Attempted to delete form: ${form.formID} from remote database while offline, try again when connected to internet.`);
      }
      db = new PouchDB("https://www.hfatracking.net/couchdb/" + remoteDB.toLowerCase());
    } else if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }

    // form = JSON.parse(JSON.stringify(form));
    var promise = db
      .get(subFormID)
      .then((doc) => {
        // console.log(doc);
        return db.put({
          _id: subFormID,
          _rev: doc._rev,
          form,
        });
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });
    this.updateSubForms();
    return promise;
  }

  saveContactLog(form: Form, familyID) {
    form = JSON.parse(JSON.stringify(form));
    var id = pouchCollate.toIndexableString([familyID, "Contact Methods"]);
    id = encodeURI(id);
    let db;
    if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }
    var promise = db
      .get(id)
      .then((doc) => {
        return db.put({
          _id: id,
          _rev: doc._rev,
          form,
        });
      })
      .catch((err) => {
        return db.put({
          _id: id,
          form,
        });
      })
      .then((res) => {
        this.updateSubForms();
        return res;
      });

    return promise;
  }

  archiveForm(form: Form, formID) {
    const archiveDB = new PouchDB("https://www.hfatracking.net/couchdb/formarchive");
    form = JSON.parse(JSON.stringify(form));
    var promise = archiveDB
      .put({
        _id: formID,
        form,
      })
      .then((res) => {
        this.updateSubForms();
        return res;
      })
      .catch((err) => {
        return err;
      });

    return promise;
  }

  saveForm(form: Form, osdb = null) {
    form = JSON.parse(JSON.stringify(form));
    var clientID = decodeURI(form.client);
    clientID = pouchCollate.parseIndexableString(clientID);

    const visitDateIndex = this._fg.indexQuestionGroup(form, "Visit Date");
    let visitDateQg: any;
    if (visitDateIndex) {
      visitDateQg = this._fg.findFormPartByIndex(form, visitDateIndex);
    } else {
      visitDateQg = {
        input: moment()
          .utc()
          .toISOString(),
      };
    }

    var id = pouchCollate.toIndexableString([clientID[0], clientID[1], clientID[2], visitDateQg.input, form.name, moment().unix()]);
    id = encodeURI(id);

    let db;
    if (osdb) {
      if (!this.online) {
        throw new Error(`Attempted to save form: ${form.formID} from remote database while offline, try again when connected to internet.`);
      }
      db = new PouchDB(`https://www.hfatracking.net/couchdb/${osdb.toLowerCase()}`);
    } else if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }
    var promise = db
      .put({
        _id: id,
        form,
      })
      .then((res) => {
        this.updateSubForms();
        return res;
      })
      .catch((err) => {
        return err;
      });

    return promise;
  }

  deleteForm(formID, OSDB = null) {
    let db;
    if (OSDB) {
      if (!this.online) {
        throw new Error(`Attempted to delete form: ${formID} from remote database while offline, try again when connected to internet.`);
      }
      db = new PouchDB("https://www.hfatracking.net/couchdb/" + OSDB.toLowerCase());
    } else if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }
    var promise = db
      .get(formID)
      .then((doc) => {
        return db.remove(doc._id, doc._rev).then((res) => {
          this.updateForms();
          this.updateSubForms();
          return res;
        });
      })
      .catch(function(err) {
        return err;
      });

    return promise;
  }

  getClient(id) {
    let db;
    if (this.online) {
      db = this.remoteFamiliesDB;
    } else {
      db = this.localFamiliesDB;
    }
    return db
      .get(id[0])
      .then((res) => {
        return res[id[1]][id[2]];
      })
      .catch((err) => {
        throw err;
      });
  }

  getUsers() {
    this._userDb = new PouchDB(`https://${ElevatedCredentials.username}:${ElevatedCredentials.password}@www.hfatracking.net/couchdb/_users`);
    return this._userDb.allDocs({ include_docs: true }).then((payload) => {
      const data = [];
      payload.rows.forEach((row) => {
        if (!row.doc._id.startsWith("_design")) {
          data.push(row.doc);
        }
      });
      return data;
    });
  }

  getUser(id) {
    this._userDb = new PouchDB(`https://${ElevatedCredentials.username}:${ElevatedCredentials.password}@www.hfatracking.net/couchdb/_users`);
    return this._userDb.get(id).then((doc) => {
      return doc;
    });
  }

  addUser(form) {
    this._userDb = new PouchDB(`https://${this.activeUser.getValue().getName()}:${this.activeUser.getValue().getPassword()}@www.hfatracking.net/couchdb/_users`);
    const tasks: Promise<any>[] = [];
    const userNameFromForm = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
    const reviewGroupFromForm = form.tabs[0].sections[0].rows[4].columns[0].questions[0].input;
    const newUserClientIdList = form.tabs[0].sections[0].rows[4].columns[1].questions[0].input;
    // const checkUser: Promise<any> = this._userDb.get(userNameFromForm);
    //const reviewGroup: Promise<any> = this.getReviewGroup(reviewGroupFromForm);
    const clientIdInputStringValidation: Promise<any> = this.validateFamilyIDInputString(newUserClientIdList).then((validation) => {
      return validation;
    });
    tasks.push(clientIdInputStringValidation);
    // tasks.push(checkUser);
    //tasks.push(reviewGroup);
    return Promise.all(tasks).then(([clientIdStringValidation]) => {
      if (!clientIdStringValidation.valid) {
        throw new Error(`Invalid family id(s): ${clientIdStringValidation.invalidIDs.join(", ")}`);
      }
      const newDoc: any = {};
      newDoc.name = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
      newDoc._id = `org.couchdb.user:${newDoc.name}`;
      newDoc.firstName = form.tabs[0].sections[0].rows[0].columns[0].questions[0].input;
      newDoc.lastName = form.tabs[0].sections[0].rows[0].columns[1].questions[0].input;
      newDoc.email = form.tabs[0].sections[0].rows[1].columns[0].questions[0].input;
      if (form.tabs[0].sections[0].rows[1].columns[1].questions[0].input !== "") {
        newDoc.password = form.tabs[0].sections[0].rows[1].columns[1].questions[0].input;
        form.tabs[0].sections[0].rows[1].columns[1].questions[0].input = "";
      }
      newDoc.roles = [form.tabs[0].sections[0].rows[3].columns[0].questions[0].input];
      newDoc.type = "user";
      newDoc.reviewGroup = reviewGroupFromForm;
      form.client = newDoc._id;
      newDoc.form = form;
      const putDoc = newDoc;
      // if (putDoc.roles.indexOf('REVIEWER') >= 0) {
      //   const reviewerIndex = reviewGroup.reviewers.indexOf(putDoc.name);
      //   if (reviewerIndex < 0) {
      //     reviewGroup.reviewers.push(putDoc.name);
      //     const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewers);
      //     reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
      //   }
      // } else {
      //   const revieweeIndex = reviewGroup.reviewees.indexOf(putDoc.name);
      //   if (revieweeIndex < 0) {
      //     reviewGroup.reviewees.push(putDoc.name);
      //     const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewees);
      //     reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
      //   }
      // }
      // let db;
      // if (this.online) {
      //   db = this.activeUser.getValue().getRemoteReviewGroupsDB();
      // } else {
      //   db = this.activeUser.getValue().getLocalReviewGroupsDB();
      // }
      return this._userDb
        .put(putDoc)
        .then((putDocResult) => {
          // return db.put(reviewGroup).then((reviewGroupRes) => {
          return [putDocResult, clientIdStringValidation.familyIDs];
          // });
        })
        .catch((err) => {
          throw err;
        });
    });
  }

  // return this._userDb
  //   .get(`org.couchdb.user:${form.tabs[0].sections[0].rows[2].columns[0].questions[0].input}`)
  //   .then((doc: any) => {
  //     let putDoc;
  //     let oldForm;
  //     if (doc) {
  //       oldForm = doc.form;
  //       doc.firstName = form.tabs[0].sections[0].rows[0].columns[0].questions[0].input;
  //       doc.lastName = form.tabs[0].sections[0].rows[0].columns[1].questions[0].input;
  //       doc.email = form.tabs[0].sections[0].rows[1].columns[0].questions[0].input;
  //       if (form.tabs[0].sections[0].rows[1].columns[1].questions[0].input !== '') {
  //         doc.password = form.tabs[0].sections[0].rows[1].columns[1].questions[0].input;
  //         form.tabs[0].sections[0].rows[1].columns[1].questions[0].input = '';
  //       }
  //       doc.name = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
  //       doc.roles = [form.tabs[0].sections[0].rows[3].columns[0].questions[0].input];
  //       doc.type = 'user';
  //       doc.form = form;
  //       putDoc = doc;
  //     }
  //     return this.getReviewGroup(form.tabs[0].sections[0].rows[4].columns[0].questions[0].input)
  //       .then((reviewGroup) => {
  //         if (putDoc.roles.indexOf('REVIEWER') >= 0) {
  //           const reviewerIndex = reviewGroup.reviewers.indexOf(putDoc.name);
  //           if (reviewerIndex < 0) {
  //             reviewGroup.reviewers.push(putDoc.name);
  //             const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewers);
  //             reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
  //             // reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].rows = newInputs.map(input => {
  //             //   return input.rows;
  //             // })
  //           }
  //         } else {
  //           const revieweeIndex = reviewGroup.reviewees.indexOf(putDoc.name);
  //           if (revieweeIndex < 0) {
  //             reviewGroup.reviewees.push(putDoc.name);
  //             const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewees);
  //             reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
  //             // reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].rows = newInputs.map(input => {
  //             //   return input.rows;
  //             // });
  //           }
  //         }
  //         let db;
  //         if (this.online) {
  //           db = this.activeUser.getValue().getRemoteReviewGroupsDB();
  //         } else {
  //           db = this.activeUser.getValue().getLocalReviewGroupsDB();
  //         }
  //         return db.put(reviewGroup);
  //       })
  //       .then((reviewGroupResult) => {
  //         // console.log(reviewGroupResult);
  //         if (form.tabs[0].sections[0].rows[4].columns[0].questions[0].input !== oldForm.tabs[0].sections[0].rows[4].columns[0].questions[0].input) {
  //           this.getReviewGroup(oldForm.tabs[0].sections[0].rows[4].columns[0].questions[0].input).then((oldReviewGroup) => {
  //             if (putDoc.roles.indexOf('REVIEWER') >= 0) {
  //               const reviewerIndex = oldReviewGroup.reviewers.indexOf(putDoc.name);
  //               oldReviewGroup.reviewers.splice(reviewerIndex, 1);
  //               const newInputs = this.makeNewInputsToUpdateArrayQuestion(oldReviewGroup.reviewers);
  //               oldReviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
  //             } else {
  //               const revieweeIndex = oldReviewGroup.reviewees.indexOf(putDoc.name);
  //               oldReviewGroup.reviewees.splice(revieweeIndex, 1);
  //               // console.log(revieweeIndex, oldReviewGroup.reviewees);
  //               const newInputs = this.makeNewInputsToUpdateArrayQuestion(oldReviewGroup.reviewees);
  //               oldReviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
  //             }
  //             let db;
  //             if (this.online) {
  //               db = this.activeUser.getValue().getRemoteReviewGroupsDB();
  //             } else {
  //               db = this.activeUser.getValue().getLocalReviewGroupsDB();
  //             }
  //             return db.put(oldReviewGroup).then((result) => {
  //               // console.log(result);
  //             });
  //           });
  //         }
  //         return this._userDb.put(putDoc);
  //       });
  //   })
  //   .then((result) => {
  //     return result;
  //   })
  //   .catch((err) => {
  //     const newDoc: any = {};
  //     newDoc.name = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
  //     newDoc._id = `org.couchdb.user:${newDoc.name}`;
  //     newDoc.firstName = form.tabs[0].sections[0].rows[0].columns[0].questions[0].input;
  //     newDoc.lastName = form.tabs[0].sections[0].rows[0].columns[1].questions[0].input;
  //     newDoc.email = form.tabs[0].sections[0].rows[1].columns[0].questions[0].input;
  //     if (form.tabs[0].sections[0].rows[1].columns[1].questions[0].input !== '') {
  //       newDoc.password = form.tabs[0].sections[0].rows[1].columns[1].questions[0].input;
  //       form.tabs[0].sections[0].rows[1].columns[1].questions[0].input = '';
  //     }
  //     newDoc.roles = [form.tabs[0].sections[0].rows[3].columns[0].questions[0].input];
  //     newDoc.type = 'user';
  //     newDoc.form = form;
  //     const putDoc = newDoc;
  //     // console.log(newDoc, putDoc);
  //     //return this._userDb.put(newDoc);
  //     return this.getReviewGroup(form.tabs[0].sections[0].rows[4].columns[0].questions[0].input)
  //       .then((reviewGroup) => {
  //         if (putDoc.roles.indexOf('REVIEWER') >= 0) {
  //           const reviewerIndex = reviewGroup.reviewers.indexOf(putDoc.name);
  //           if (reviewerIndex < 0) {
  //             reviewGroup.reviewers.push(putDoc.name);
  //             const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewers);
  //             reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
  //             // reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].rows = newInputs.map(input => {
  //             //   return input.rows;
  //             // });
  //           }
  //         } else {
  //           const revieweeIndex = reviewGroup.reviewees.indexOf(putDoc.name);
  //           if (revieweeIndex < 0) {
  //             reviewGroup.reviewees.push(putDoc.name);
  //             const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewees);
  //             reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
  //             // reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].rows = newInputs.map(input => {
  //             //   return input.rows;
  //             // });
  //           }
  //         }
  //         let db;
  //         if (this.online) {
  //           db = this.activeUser.getValue().getRemoteReviewGroupsDB();
  //         } else {
  //           db = this.activeUser.getValue().getLocalReviewGroupsDB();
  //         }
  //         return db.put(reviewGroup);
  //       })
  //       .then((reviewGroupResult) => {
  //         // console.log(reviewGroupResult);
  //         return this._userDb.put(putDoc);
  //       })
  //       .catch((err) => {
  //         return err;
  //       });
  //   });

  updateUser(form) {
    this._userDb = new PouchDB(`https://${ElevatedCredentials.username}:${ElevatedCredentials.password}@www.hfatracking.net/couchdb/_users`);
    const tasks: Promise<any>[] = [];
    const userNameFromForm = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
    const reviewGroupFromForm = form.tabs[0].sections[0].rows[4].columns[0].questions[0].input;
    const newUserClientIdList = form.tabs[0].sections[0].rows[4].columns[1].questions[0].input;

    const user = this._userDb.get(`org.couchdb.user:${userNameFromForm}`).then((user) => {
      return user;
    });

    // const oldReviewGroup = this._userDb.get(`org.couchdb.user:${userNameFromForm.toLowerCase()}`).then((user) => {
    //   let db;
    //   if (this.online) {
    //     db = this.activeUser.getValue().getRemoteReviewGroupsDB();
    //   } else {
    //     db = this.activeUser.getValue().getLocalReviewGroupsDB();
    //   }
    //   // If user hasn't been saved with a form than we must set the passed in form to be the form for that user
    //   if (!user.form) {
    //     user.form = form;
    //   }
    //   return db.get(user.form.tabs[0].sections[0].rows[4].columns[0].questions[0].input).then((reviewGroup) => {
    //     return reviewGroup;
    //   });
    // });
    // const reviewGroup: Promise<any> = this.getReviewGroup(reviewGroupFromForm);
    const clientIdInputStringValidation: Promise<any> = this.validateFamilyIDInputString(newUserClientIdList).then((validation) => {
      return validation;
    });
    tasks.push(user);
    // tasks.push(oldReviewGroup);
    tasks.push(clientIdInputStringValidation);
    // tasks.push(reviewGroup);
    return Promise.all(tasks)
      .then(([user, clientIdStringValidation]) => {
        if (!clientIdStringValidation.valid) {
          throw new Error(`Invalid family id(s): ${clientIdStringValidation.invalidIDs.join(", ")}`);
        }

        user.firstName = form.tabs[0].sections[0].rows[0].columns[0].questions[0].input;
        user.lastName = form.tabs[0].sections[0].rows[0].columns[1].questions[0].input;
        user.email = form.tabs[0].sections[0].rows[1].columns[0].questions[0].input;
        if (form.tabs[0].sections[0].rows[1].columns[1].questions[0].input !== "") {
          user.password = form.tabs[0].sections[0].rows[1].columns[1].questions[0].input;
          form.tabs[0].sections[0].rows[1].columns[1].questions[0].input = "";
        }
        user.name = form.tabs[0].sections[0].rows[2].columns[0].questions[0].input;
        user.roles = [form.tabs[0].sections[0].rows[3].columns[0].questions[0].input];
        user.type = "user";
        form.client = user._id;
        user.form = form;

        const dbUpdates: Promise<any>[] = [];
        // if (oldReviewGroup._id !== reviewGroup._id) {
        // review group was update so we must make changes to the review group database and delete from the old while adding to the new
        // if (user.roles.indexOf('REVIEWER') >= 0) {
        //   const reviewerIndex = reviewGroup.reviewers.indexOf(user.name);
        //   if (reviewerIndex < 0) {
        //     reviewGroup.reviewers.push(user.name);
        //     const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewers);
        //     reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
        //   }
        // } else {
        //   const revieweeIndex = reviewGroup.reviewees.indexOf(user.name);
        //   if (revieweeIndex < 0) {
        //     reviewGroup.reviewees.push(user.name);
        //     const newInputs = this.makeNewInputsToUpdateArrayQuestion(reviewGroup.reviewees);
        //     reviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
        //   }
        // }
        // make changes to old review group if neccesary
        // if (user.roles.indexOf('REVIEWER') >= 0) {
        //   const reviewerIndex = oldReviewGroup.reviewers.indexOf(user.name);
        //   oldReviewGroup.reviewers.splice(reviewerIndex, 1);
        //   const newInputs = this.makeNewInputsToUpdateArrayQuestion(oldReviewGroup.reviewers);
        //   oldReviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
        // } else {
        //   const revieweeIndex = oldReviewGroup.reviewees.indexOf(user.name);
        //   oldReviewGroup.reviewees.splice(revieweeIndex, 1);
        //   // console.log(revieweeIndex, oldReviewGroup.reviewees);
        //   const newInputs = this.makeNewInputsToUpdateArrayQuestion(oldReviewGroup.reviewees);
        //   oldReviewGroup.form.tabs[0].sections[0].rows[1].columns[0].questions[0].input = newInputs;
        // }
        // let reviewGroupDb;
        // if (this.online) {
        //   reviewGroupDb = this.activeUser.getValue().getRemoteReviewGroupsDB();
        // } else {
        //   reviewGroupDb = this.activeUser.getValue().getLocalReviewGroupsDB();
        // }
        // push review group and user database update promises to an array so they can all be resolved at the same time with Promise.all()
        // dbUpdates.push(
        //   reviewGroupDb.put(reviewGroup).then((reviewGroupRes) => {
        //     return reviewGroupRes;
        //   })
        // );
        // dbUpdates.push(
        //   reviewGroupDb.put(oldReviewGroup).then((oldReviewGroupRes) => {
        //     return oldReviewGroupRes;
        //   })
        // );
        // }

        return this._userDb.put(user).then((userRes) => {
          return [userRes, clientIdStringValidation.familyIDs];
        });

        // resolve and return all updates plus the family id's so the users clients can be updated
        // return Promise.all(dbUpdates)
        //   .then(([userRes]) => {
        //     return [userRes, clientIdStringValidation.familyIDs];
        //   })
        //   .catch((err) => {
        //     throw err;
        //   });
      })
      .catch((err) => {
        throw err;
      });
  }

  makeNewInputsToUpdateArrayQuestion(inputValues) {
    const newInputs: any[] = [];
    inputValues.forEach((value) => {
      newInputs.push({
        rows: [
          {
            columnGap: 0,
            columns: [
              {
                width: "nogrow",
                offset: 0,
                align: "auto",
                rows: [],
                questions: [
                  {
                    key: `User Name ${value}`,
                    label: "User Name",
                    labelPosition: "top",
                    labelWidth: "",
                    type: "textbox",
                    description: "",
                    required: true,
                    notes: [],
                    validators: {
                      description: "Required",
                    },
                    usePreviousValue: true,
                    input: value,
                    default: "",
                    placeholder: "New Os Name",
                    hint: "",
                  },
                ],
              },
            ],
          },
        ],
      });
    });
    // console.log(newInputs);
    return newInputs;
  }

  addUpdateUserClients(userName, familyIDInputString) {
    const clientUpdateResult: any = {};
    return this.validateFamilyIDInputString(familyIDInputString)
      .then((validation) => {
        if (!validation.valid) {
          clientUpdateResult.success = false;
          clientUpdateResult.message = "Invalid family id(s)";
          clientUpdateResult.rejectIDs = validation.invalidIDs;
          return clientUpdateResult;
        }

        let db;
        if (this.online) {
          db = new PouchDB("https://www.hfatracking.net/couchdb/" + userName.toLowerCase());
        } else {
          db = new PouchDB(userName.toLowerCase());
        }

        return db
          .get("clients")
          .then((clients) => {
            const newClients = [];
            validation.familyIDs.forEach((id) => {
              newClients.push({ familyID: id });
            });
            clients.clients = newClients;
            return db.put(clients);
          })
          .catch((err) => {
            const newClients = [];
            const newClientsDoc: any = {};
            validation.familyIDs.forEach((id) => {
              newClients.push({ familyID: id });
            });
            newClientsDoc.clients = newClients;
            newClientsDoc._id = "clients";
            return db.put(newClientsDoc);
          });
      })
      .then((result) => {
        if (result.status === "ok") {
          clientUpdateResult.success = true;
        } else {
          clientUpdateResult.sucess = false;
          clientUpdateResult.message = "Something went wrong with updating client list";
        }
        return clientUpdateResult;
      });
  }
  validateFamilyIDInputString(inputString) {
    const result: any = {};
    let valid;
    let db;
    const invalidIDs = [];
    if (this.online) {
      db = this.remoteFamiliesDB;
    } else {
      db = this.localFamiliesDB;
    }
    const splitInput = inputString
      .split(" ")
      .join("")
      .split(",");
    return db.allDocs({ include_docs: true }).then((payload) => {
      const existingIdArray = payload.rows.map((row) => {
        return row.doc._id;
      });
      splitInput.forEach((input) => {
        if (existingIdArray.indexOf(input) < 0) {
          invalidIDs.push(input);
        }
      });
      if (invalidIDs.length > 0) {
        result.valid = false;
        result.invalidIDs = invalidIDs;
      } else {
        result.valid = true;
        result.familyIDs = splitInput;
      }
      return result;
    });
  }
  // Uses all user dbs to find all queued forms. used mainly in admin;
  getAllQueuedForms(): Promise<any[]> {
    const queuedFormPromises = [];
    return this.getUsers().then((osDocs) => {
      for (const doc of osDocs) {
        if (doc._id.startsWith("org.couchdb.user")) {
          const tempUserDb = new PouchDB(`https://${this.activeUser.getValue().getName()}:${this.activeUser.getValue().getPassword()}@www.hfatracking.net/couchdb/${doc.name.toLowerCase()}`);
          queuedFormPromises.push(tempUserDb.allDocs({ include_docs: true }));
        }
      }
      return Promise.all(queuedFormPromises)
        .then((payload) => {
          const formsInQueue = [];
          for (const meta of payload) {
            for (const row of meta.rows) {
              const doc = row.doc;

              if (doc._id !== "clients") {
                if (doc.form && (doc.form.status && doc.form.status.length > 0) && doc.form.status[doc.form.status.length - 1].value === "queued") {
                  this.getForm(doc.form.formID).then((form) => {
                    const expandedForm = this._fg.expand(form.form, doc.form);

                    const visitDateIndex = this._fg.indexQuestionGroup(expandedForm, "Visit Date");
                    const visitDate = this._fg.findFormPartByIndex(expandedForm, visitDateIndex).input;
                    switch (expandedForm.name) {
                      case "Adult Visit":
                        expandedForm.dateSubmitted = moment(expandedForm.status[expandedForm.status.length - 1].date).format("MMM DD YYYY");
                        expandedForm.visitDate = moment(visitDate).format("MMM DD YYYY");

                        break;
                      case "Child Visit":
                        expandedForm.dateSubmitted = moment(expandedForm.status[expandedForm.status.length - 1].date).format("MMM DD YYYY");
                        expandedForm.visitDate = moment(visitDate).format("MMM DD YYYY");

                        break;
                      case "Termination Form":
                        expandedForm.dateSubmitted = moment(expandedForm.status[expandedForm.status.length - 1].date).format("MMM DD YYYY");
                        expandedForm.visitDate = moment(visitDate).format("MMM DD YYYY");

                        break;
                      case "Parent Survey":
                        expandedForm.dateSubmitted = moment(expandedForm.status[expandedForm.status.length - 1].date).format("MMM DD YYYY");
                        expandedForm.visitDate = moment(visitDate).format("MMM DD YYYY");

                        break;
                      case "Missed Visit":
                        expandedForm.dateSubmitted = moment(expandedForm.status[expandedForm.status.length - 1].date).format("MMM DD YYYY");
                        expandedForm.visitDate = moment(visitDate).format("MMM DD YYYY");

                        break;
                      case "Contact Log":
                        expandedForm.dateSubmitted = moment(expandedForm.status[expandedForm.status.length - 1].date).format("MMM DD YYYY");
                        expandedForm.visitDate = moment(expandedForm.tabs[0].sections[0].rows[0].columns[0].questions[0].value).format("MMM DD YYYY");

                        break;
                      default:
                        break;
                    }
                    formsInQueue.push(doc);
                  });
                }
              }
            }
          }
          formsInQueue.sort((a, b) => {
            const aDate = moment(pouchCollate.parseIndexableString(decodeURI(a._id))[3]);
            const bDate = moment(pouchCollate.parseIndexableString(decodeURI(b._id))[3]);
            if (aDate.isAfter(bDate)) {
              return -1;
            }
            if (aDate.isBefore(bDate)) {
              return 1;
            }
            return 0;
          });
          return formsInQueue;
        })
        .catch((err) => console.error(err));
    });
  }

  updateOs(OsFg: any) {
    this._userDb = new PouchDB("https://www.hfatracking.net/couchdb/_users");
    return this._userDb.put(OsFg);
  }

  getAllClientFormsByType(clientID, formName) {
    let db;
    if (this.online) {
      db = this.remoteUserDB;
    } else {
      db = this.localUserDB;
    }
    console.info(`getAllFormsByType(${clientID}, ${formName})`);
    const encodedID = clientID.slice(0, clientID.length - 3);
    return db
      .allDocs({
        include_docs: true,
        startkey: encodedID + "\uffff",
        endkey: encodedID,
        descending: true,
      })
      .then((res) => {
        const forms = res.rows.map((row) => {
          return row.doc;
        });
        return forms.filter((form) => {
          if (form._id !== "clients" && !form._id.startsWith("_design")) {
            return form.form.name === formName;
          }
        });
      })
      .catch((err) => console.log(err));
  }

  getArchivedFormsForFamily(familyID, osID) {
    const familyArchive = {
      familyID,
      osID,
      adultVisits: [],
      childVisits: [],
      terminations: [],
      missedVisits: [],
      parentSurveys: [],
      contactLogs: [],
    };
    const archiveDb = new PouchDB("https://www.hfatracking.net/couchdb/formarchive");
    return archiveDb.query("archiveFormsDesign/archivedByFamilyAndOS", { key: [familyID, osID] }).then((payload) => {
      for (const row of payload.rows) {
        const visitDateIndex = this._fg.indexQuestionGroup(row.value.form, "Visit Date");
        const visitDate = this._fg.findFormPartByIndex(row.value.form, visitDateIndex).input;
        switch (row.value.form.name) {
          case "Adult Visit":
            row.value.form.dateSubmitted = moment(row.value.form.status[row.value.form.status.length - 1].date).format("MMM DD YYYY");
            row.value.form.visitDate = moment(visitDate).format("MMM DD YYYY");
            familyArchive.adultVisits.push(row.value);
            break;
          case "Child Visit":
            row.value.form.dateSubmitted = moment(row.value.form.status[row.value.form.status.length - 1].date).format("MMM DD YYYY");
            row.value.form.visitDate = moment(visitDate).format("MMM DD YYYY");
            familyArchive.childVisits.push(row.value);
            break;
          case "Termination Form":
            row.value.form.dateSubmitted = moment(row.value.form.status[row.value.form.status.length - 1].date).format("MMM DD YYYY");
            row.value.form.visitDate = moment(visitDate).format("MMM DD YYYY");
            familyArchive.terminations.push(row.value);
            break;
          case "Parent Survey":
            row.value.form.dateSubmitted = moment(row.value.form.status[row.value.form.status.length - 1].date).format("MMM DD YYYY");
            row.value.form.visitDate = moment(visitDate).format("MMM DD YYYY");
            familyArchive.parentSurveys.push(row.value);
            break;
          case "Missed Visit":
            row.value.form.dateSubmitted = moment(row.value.form.status[row.value.form.status.length - 1].date).format("MMM DD YYYY");
            row.value.form.visitDate = moment(visitDate).format("MMM DD YYYY");
            familyArchive.missedVisits.push(row.value);
            break;
          case "Contact Log":
            row.value.form.dateSubmitted = moment(row.value.form.status[row.value.form.status.length - 1].date).format("MMM DD YYYY");
            row.value.form.visitDate = moment(row.value.form.tabs[0].sections[0].rows[0].columns[0].questions[0].value).format("MMM DD YYYY");
            familyArchive.contactLogs.push(row.value);
            break;
          default:
            break;
        }
      }
      for (const prop in familyArchive) {
        if (Array.isArray(familyArchive[prop])) {
          familyArchive[prop].sort((a, b) => {
            const aDate = moment(pouchCollate.parseIndexableString(decodeURI(a._id))[3]);
            const bDate = moment(pouchCollate.parseIndexableString(decodeURI(b._id))[3]);
            if (aDate.isAfter(bDate)) {
              return -1;
            }
            if (aDate.isBefore(bDate)) {
              return 1;
            }
            return 0;
          });
        }
      }
      return familyArchive;
    });
  }

  getArchivedForm(id) {
    const archiveDb = new PouchDB("https://www.hfatracking.net/couchdb/formarchive");
    return archiveDb.get(id).then((doc) => {
      return doc;
    });
  }

  getArchivedFormsByType() {
    const formArchive = {
      adultVisits: [],
      childVisits: [],
      terminations: [],
      missedVisits: [],
      parentSurveys: [],
      contactLogs: [],
    };
    const archiveDb = new PouchDB("https://www.hfatracking.net/couchdb/formarchive");
    return archiveDb.allDocs({ include_docs: true }).then((payload) => {
      // console.log(payload);
      for (const row of payload.rows) {
        if (!row.id.startsWith("_design")) {
          const visitDateIndex = this._fg.indexQuestionGroup(row.doc.form, "Visit Date");
          const visitDate = this._fg.findFormPartByIndex(row.doc.form, visitDateIndex).input;
          switch (row.doc.form.name) {
            case "Adult Visit":
              row.doc.form.dateSubmitted = moment(row.doc.form.status[row.doc.form.status.length - 1].date).format("MMM DD YYYY");
              row.doc.form.visitDate = moment(visitDate).format("MMM DD YYYY");
              formArchive.adultVisits.push(row.doc);
              break;
            case "Child Visit":
              row.doc.form.dateSubmitted = moment(row.doc.form.status[row.doc.form.status.length - 1].date).format("MMM DD YYYY");
              row.doc.form.visitDate = moment(visitDate).format("MMM DD YYYY");
              formArchive.childVisits.push(row.doc);
              break;
            case "Termination Form":
              row.doc.form.dateSubmitted = moment(row.doc.form.status[row.doc.form.status.length - 1].date).format("MMM DD YYYY");
              row.doc.form.visitDate = moment(visitDate).format("MMM DD YYYY");
              formArchive.terminations.push(row.doc);
              break;
            case "Parent Survey":
              row.doc.form.dateSubmitted = moment(row.doc.form.status[row.doc.form.status.length - 1].date).format("MMM DD YYYY");
              row.doc.form.visitDate = moment(visitDate).format("MMM DD YYYY");
              formArchive.parentSurveys.push(row.doc);
              break;
            case "Missed Visit":
              row.doc.form.dateSubmitted = moment(row.doc.form.status[row.doc.form.status.length - 1].date).format("MMM DD YYYY");
              row.doc.form.visitDate = moment(visitDate).format("MMM DD YYYY");
              formArchive.missedVisits.push(row.doc);
              break;
            case "Contact Log":
              row.doc.form.dateSubmitted = moment(row.doc.form.status[row.doc.form.status.length - 1].date).format("MMM DD YYYY");
              row.doc.form.visitDate = moment(row.doc.form.tabs[0].sections[0].rows[0].columns[0].questions[0].value).format("MMM DD YYYY");
              formArchive.contactLogs.push(row.doc);
              break;
            default:
              break;
          }
        }
      }
      for (const prop in formArchive) {
        if (Array.isArray(formArchive[prop])) {
          formArchive[prop].sort((a, b) => {
            const aDate = moment(pouchCollate.parseIndexableString(decodeURI(a._id))[3]);
            const bDate = moment(pouchCollate.parseIndexableString(decodeURI(b._id))[3]);
            if (aDate.isAfter(bDate)) {
              return -1;
            }
            if (aDate.isBefore(bDate)) {
              return 1;
            }
            return 0;
          });
        }
      }
      return formArchive;
    });
  }

  addUpdateReviewGroup(form) {
    let db;
    if (this.online) {
      db = this.activeUser.getValue().getRemoteReviewGroupsDB();
    } else {
      db = this.activeUser.getValue().getLocalReviewGroupsDB();
    }

    return this.getReviewGroup(form.tabs[0].sections[0].rows[0].columns[0].questions[0].input)
      .then((doc) => {
        if (doc) {
          // console.log(doc);
          const newReviewees = [];
          const newReviewers = [];
          form.tabs[0].sections[0].rows[1].columns[0].questions[0].input.map((input) => {
            input.rows.map((row) => {
              row.columns.map((column) => {
                column.questions.map((question) => {
                  newReviewees.push(question.input);
                });
              });
            });
          });
          form.tabs[0].sections[0].rows[2].columns[0].questions[0].input.map((input) => {
            input.rows.map((row) => {
              row.columns.map((column) => {
                column.questions.map((question) => {
                  newReviewers.push(question.input);
                });
              });
            });
          });
          doc.reviewees = newReviewees;
          doc.reviewers = newReviewers;
          doc.form = form;
          return db.put(doc);
        } else {
          const newGroup: any = {};
          const newReviewees = [];
          const newReviewers = [];
          newGroup._id = form.tabs[0].sections[0].rows[0].columns[0].questions[0].input;
          form.tabs[0].sections[0].rows[1].columns[0].questions[0].input.map((input) => {
            input.rows.map((row) => {
              row.columns.map((column) => {
                column.questions.map((question) => {
                  newReviewees.push(question.input);
                });
              });
            });
          });
          form.tabs[0].sections[0].rows[2].columns[0].questions[0].input.map((input) => {
            input.rows.map((row) => {
              row.columns.map((column) => {
                column.questions.map((question) => {
                  newReviewers.push(question.input);
                });
              });
            });
          });
          newGroup.reviewees = newReviewees;
          newGroup.reviewers = newReviewers;
          newGroup.form = form;
          return db.put(newGroup);
        }
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }

  getReviewGroup(id) {
    let db;
    if (this.online) {
      db = this.activeUser.getValue().getRemoteReviewGroupsDB();
    } else {
      db = this.activeUser.getValue().getLocalReviewGroupsDB();
    }

    return db
      .get(id)
      .then((doc) => {
        return doc;
      })
      .catch((err) => {
        return null;
      });
  }

  getReviewGroups() {
    let db;
    if (this.online) {
      db = this.activeUser.getValue().getRemoteReviewGroupsDB();
    } else {
      db = this.activeUser.getValue().getLocalReviewGroupsDB();
    }

    return db.allDocs({ include_docs: true }).then((payload) => {
      // console.log(payload);
      const docs = payload.rows.map((row) => {
        return row.doc;
      });
      return docs;
    });
  }

  putClientDoc(dbName, familyIDs) {
    const db = new PouchDB(`https://${this.activeUser.getValue().getName()}:${this.activeUser.getValue().getPassword()}@www.hfatracking.net/couchdb/${dbName.toLowerCase()}`);
    return db
      .get("clients")
      .then((doc) => {
        const newClients = [];
        for (const id of familyIDs) {
          newClients.push({ familyID: id });
        }
        doc.clients = newClients;
        db.put(doc).then((putDocResult) => {
          return putDocResult;
        });
      })
      .catch((err) => {
        const newDoc: any = {};
        newDoc._id = "clients";
        const newClients = [];
        for (const id of familyIDs) {
          newClients.push({ familyID: id });
        }
        newDoc.clients = newClients;
        db.put(newDoc).then((putDocResult) => {
          return putDocResult;
        });
      });
  }

  getActiveUser() {
    return this.activeUser.getValue();
  }

  getAllClientVisits(clientID, formName) {
    const visitFormPromises = [];
    return this.getUsers().then((osDocs) => {
      for (const doc of osDocs) {
        if (doc._id.startsWith("org.couchdb.user")) {
          const tempUserDb = new PouchDB(`https://${this.activeUser.getValue().getName()}:${this.activeUser.getValue().getPassword()}@www.hfatracking.net/couchdb/${doc.name.toLowerCase()}`);
          visitFormPromises.push(tempUserDb.allDocs({ include_docs: true }));
        }
      }
      return Promise.all(visitFormPromises)
        .then((payload) => {
          const formsInQueue = [];
          for (const meta of payload) {
            for (const row of meta.rows) {
              const doc = row.doc;

              if (doc._id !== "clients") {
                if (doc.form && doc.form.client === clientID && doc.form.name === formName) {
                  formsInQueue.push(doc);
                }
              }
            }
          }
          formsInQueue.sort((a, b) => {
            const aDate = moment(pouchCollate.parseIndexableString(decodeURI(a._id))[3]);
            const bDate = moment(pouchCollate.parseIndexableString(decodeURI(b._id))[3]);
            if (aDate.isAfter(bDate)) {
              return -1;
            }
            if (aDate.isBefore(bDate)) {
              return 1;
            }
            return 0;
          });
          return formsInQueue;
        })
        .catch((err) => console.error(err));
    });
  }

  getAllClientArchivedVisits(clientID, formName) {
    const archiveDb = new PouchDB("https://www.hfatracking.net/couchdb/formarchive");
    const archivedVisits: any[] = [];
    return archiveDb.allDocs({ include_docs: true }).then((payload) => {
      for (const row of payload.rows) {
        if (!row.doc._id.startsWith("_design")) {
          if (row.doc.form && row.doc.form.client === clientID && row.doc.form.name === formName) {
            archivedVisits.push(row.doc);
          }
        }
      }
      archivedVisits.sort((a, b) => {
        const aDate = moment(pouchCollate.parseIndexableString(decodeURI(a._id))[3]);
        const bDate = moment(pouchCollate.parseIndexableString(decodeURI(b._id))[3]);
        if (aDate.isAfter(bDate)) {
          return -1;
        }
        if (aDate.isBefore(bDate)) {
          return 1;
        }
        return 0;
      });
      return archivedVisits;
    });
  }

  getAllClientVisitsIgnoreType(clientID) {
    const visitFormPromises = [];
    return this.getUsers().then((osDocs) => {
      for (const doc of osDocs) {
        if (doc._id.startsWith("org.couchdb.user")) {
          const tempUserDb = new PouchDB(`https://${this.activeUser.getValue().getName()}:${this.activeUser.getValue().getPassword()}@www.hfatracking.net/couchdb/${doc.name.toLowerCase()}`);
          visitFormPromises.push(tempUserDb.allDocs({ include_docs: true }));
        }
      }
      return Promise.all(visitFormPromises)
        .then((payload) => {
          const formsInQueue = [];
          for (const meta of payload) {
            for (const row of meta.rows) {
              const doc = row.doc;

              if (doc._id !== "clients") {
                if (doc.form && doc.form.client === clientID) {
                  this._fg.isCompressed(doc.form) ? (doc.form = this._fg.expand(this.allFormsMap.get(doc.form.name), doc.form)) : doc.form;
                  const visitDateIndex = this._fg.indexQuestionGroup(doc.form, "Visit Date");
                  const visitDate = this._fg.findFormPartByIndex(doc.form, visitDateIndex).input;
                  doc.form.dateSubmitted = moment(doc.form.status[doc.form.status.length - 1].date).format("MMM DD YYYY");
                  doc.form.visitDate = moment(visitDate).format("MMM DD YYYY");
                  formsInQueue.push(doc);
                }
              }
            }
          }
          formsInQueue.sort((a, b) => {
            const aDate = moment(pouchCollate.parseIndexableString(decodeURI(a._id))[3]);
            const bDate = moment(pouchCollate.parseIndexableString(decodeURI(b._id))[3]);
            if (aDate.isAfter(bDate)) {
              return -1;
            }
            if (aDate.isBefore(bDate)) {
              return 1;
            }
            return 0;
          });
          return formsInQueue;
        })
        .catch((err) => console.error(err));
    });
  }

  getAllClientArchivedVisitsIgnoreType(clientID) {
    const archiveDb = new PouchDB("https://www.hfatracking.net/couchdb/formarchive");
    const archivedVisits: any[] = [];
    return archiveDb.allDocs({ include_docs: true }).then((payload) => {
      for (const row of payload.rows) {
        if (!row.doc._id.startsWith("_design")) {
          if (row.doc.form && row.doc.form.client === clientID) {
            this._fg.isCompressed(row.doc.form) ? (row.doc.form = this._fg.expand(this.allFormsMap.get(row.doc.form.name), row.doc.form)) : row.doc.form;
            const visitDateIndex = this._fg.indexQuestionGroup(row.doc.form, "Visit Date");
            const visitDate = this._fg.findFormPartByIndex(row.doc.form, visitDateIndex).input;
            row.doc.form.dateSubmitted = moment(row.doc.form.status[row.doc.form.status.length - 1].date).format("MMM DD YYYY");
            row.doc.form.visitDate = moment(visitDate).format("MMM DD YYYY");
            archivedVisits.push(row.doc);
          }
        }
      }
      archivedVisits.sort((a, b) => {
        const aDate = moment(pouchCollate.parseIndexableString(decodeURI(a._id))[3]);
        const bDate = moment(pouchCollate.parseIndexableString(decodeURI(b._id))[3]);
        if (aDate.isAfter(bDate)) {
          return -1;
        }
        if (aDate.isBefore(bDate)) {
          return 1;
        }
        return 0;
      });
      return archivedVisits;
    });
  }

  getAllFamilyVisits(familyID) {
    return this.getFamily(familyID).then((family) => {
      const adultVisitPromises = [];
      const adultArchivePromises = [];
      const childVisitPromises = [];
      const childArchivePromises = [];
      const allPromises = [];
      for (const adult of family.adult) {
        adultVisitPromises.push(
          this.getAllClientVisits(adult.clientID || adult.form.client, "Adult Visit").then((visits) => {
            return {
              firstName: adult.clientFName,
              lastNme: adult.clientLName,
              clientID: adult.clientID || adult.form.client,
              visits: visits,
            };
          })
        );
        adultArchivePromises.push(
          this.getAllClientArchivedVisits(adult.clientID || adult.form.client, "Adult Visit").then((visits) => {
            return {
              firstName: adult.clientFName,
              lastNme: adult.clientLName,
              clientID: adult.clientID || adult.form.client,
              visits: visits,
            };
          })
        );
        allPromises.push(adultVisitPromises);
        allPromises.push(adultArchivePromises);
      }
      for (const child of family.child) {
        childVisitPromises.push(
          this.getAllClientVisits(child.clientID || child.form.client, "Child Visit").then((visits) => {
            return {
              firstName: child.clientFName,
              lastNme: child.clientLName,
              clientID: child.clientID || child.form.client,
              visits: visits,
            };
          })
        );
        childArchivePromises.push(
          this.getAllClientArchivedVisits(child.clientID || child.form.client, "Child Visit").then((visits) => {
            return {
              firstName: child.clientFName,
              lastNme: child.clientLName,
              clientID: child.clientID || child.form.client,
              visits: visits,
            };
          })
        );
        allPromises.push(childVisitPromises);
        allPromises.push(childArchivePromises);
      }
      return Promise.all(adultVisitPromises).then((adultVisits) => {
        return Promise.all(adultArchivePromises).then((adultArchive) => {
          return Promise.all(childVisitPromises).then((childVisits) => {
            return Promise.all(childArchivePromises).then((childArchive) => {
              return {
                family: family,
                adultActive: adultVisits,
                adultArchive: adultArchive,
                childActive: childVisits,
                childArchive: childArchive,
              };
            });
          });
        });
      });
    });
  }

  getFamilyByPrimaryName(name) {
    let db;
    if (this.online) {
      db = this.remoteFamiliesDB;
    } else {
      db = this.localFamiliesDB;
    }
    return db.query("clients/byPrimaryName", { key: name, include_docs: true }).then((payload) => {
      return payload;
    });
  }

  getVisit(id, os) {
    let db;
    if (this.online) {
      db = new PouchDB(`https://${ElevatedCredentials.username}:${ElevatedCredentials.password}@www.hfatracking.net/couchdb/${os.toLowerCase()}`);
    } else {
      throw new Error("Can't access remote OS database while offline");
    }

    return db.get(id);
  }
}
