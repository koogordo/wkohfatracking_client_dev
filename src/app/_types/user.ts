import { BehaviorSubject, Observable } from "rxjs";
import { mapTo } from "rxjs/operators";
import * as $PouchDB from "pouchdb";
import * as $PouchAuth from "pouchdb-authentication";
const PouchDB = $PouchDB["default"];
const PouchAuth = $PouchAuth["default"];
export class User {
  //constant class variables
  private couchUri = "https://www.hfatracking.net/couchdb/";
  private static encryptKey = "4398f77362nknc736cibc93947327f23gblasfdlkavn74672543040hf-c4";
  private _id: string;
  private _rev: string;
  private name: string;
  private fullname: string;
  private wkoid: number;
  private reviewerGroups: string[];
  private roles: string[];
  private type: string;
  private password: string;
  // These are visit forms filled out by an OS and reviewed by reviewers
  private forms: any[];
  private osFlag: boolean;
  private adminFlag: boolean;
  private reviewerFlag: boolean;

  //remote databases
  private remoteUserDB: any;
  private remoteFormsDB: any;
  private remoteFamiliesDB: any;
  private remoteReviewGroupsDB: any;

  // local databases
  private localUserDB: any;
  private localFormsDB: any;
  private localFamiliesDB: any;
  private localReviewGroupsDB: any;
  private assignedOses: User[];
  private errors;
  // families the os has been assigned to
  public remoteUserDBFeed: BehaviorSubject<any>;
  public localUserDBFeed: BehaviorSubject<any>;

  public remoteFormsDBFeed: BehaviorSubject<any>;
  public remoteFamiliesDBFeed: BehaviorSubject<any>;
  public remoteReviewGroupsDBFeed: BehaviorSubject<any>;

  private localFormsDBFeed: BehaviorSubject<any>;
  private localFamiliesDBFeed: BehaviorSubject<any>;
  private localReviewGroupsDBFeed: BehaviorSubject<any>;
  public families: any[];
  private reviewGroup;
  // used to keep a memory of the os context and family context of the current reviewer;
  private savedOsContext;
  private savedFamilyContext;
  constructor(username, password, roles = [], remoteUserDB = null) {
    // add authentication functionality to PouchDB
    PouchDB.plugin(PouchAuth);
    this.errors = [];
    this.name = username;
    this.password = password;
    this.roles = roles;
    this.setRoles(this.roles);
    this.remoteUserDB = remoteUserDB;
  }

  private toID(username) {
    return `org.couchdb.user:${username}`;
  }

  private setRoleIdentifiers(roles) {
    if (roles.indexOf("OS") >= 0) {
      this.osFlag = true;
    }
    if (roles.indexOf("REVIEWER") >= 0) {
      this.reviewerFlag = true;
    }
    if (roles.indexOf("_admin") >= 0) {
      this.adminFlag = true;
    }
  }

  public isAdmin(): boolean {
    return this.adminFlag;
  }
  public isReviewer(): boolean {
    return this.reviewerFlag;
  }
  public isOs(): boolean {
    return this.osFlag;
  }
  public getReviewGroup() {
    return this.reviewGroup;
  }
  public setReviewGroup(val) {
    this.reviewGroup = val;
  }
  public setRev(rev: string) {
    this._rev = rev;
  }
  public getRev(): string {
    return this._rev;
  }

  public setID(id: string) {
    this._id = id;
  }
  public getID(): string {
    return this._id;
  }

  public setName(username: string) {
    this.name = username;
  }
  public getName(): string {
    return this.name;
  }

  public setFullname(fullname: string) {
    this.fullname = fullname;
  }
  public getFullname(): string {
    return this.fullname;
  }

  public setRoles(roles: string[]) {
    this.roles = roles;
    this.setRoleIdentifiers(roles);
  }
  public getRoles(): string[] {
    return this.roles;
  }

  public setReviewerGroups(groups: string[]) {
    this.reviewerGroups = groups;
  }
  public getReviewerGroups(): string[] {
    return this.reviewerGroups;
  }

  public setWKOID(wkoid: number) {
    this.wkoid = wkoid;
  }
  public getWKOID(): number {
    return this.wkoid;
  }

  public setUserType(type: string) {
    this.type = type;
  }
  public getUserType() {
    return this.type;
  }

  public getPassword(): string {
    return this.password;
  }
  public setPassword(newPassword: string) {
    this.password = newPassword;
  }

  public getSavedOsContext() {
    return this.savedOsContext;
  }
  public setSavedOsContext(context) {
    this.savedOsContext = context;
  }

  public getSavedFamilyContext() {
    return this.savedFamilyContext;
  }
  public setSavedFamilyContext(context) {
    this.savedFamilyContext = context;
  }
  // user db getters and setters
  public getRemoteUserDB() {
    return this.remoteUserDB;
  }
  public getLocalUserDB() {
    return this.localUserDB;
  }
  public setRemoteUserDB(db: any) {
    this.remoteUserDB = db;
  }
  public setLocalUserDB(db: any) {
    this.localUserDB = db;
  }

  // forms db getters and setters
  public getRemoteFormsDB() {
    return this.remoteFormsDB;
  }
  public getLocalFormsDB() {
    return this.localFormsDB;
  }
  public setRemoteFormsDB(db: any) {
    this.remoteFormsDB = db;
  }
  public setLocalFormsDB(db: any) {
    this.localFormsDB = db;
  }

  // family db getters and setters
  public getRemoteFamiliesDB() {
    return this.remoteFamiliesDB;
  }
  public getLocalFamiliesDB() {
    return this.localFamiliesDB;
  }
  public setRemoteFamiliesDB(db: any) {
    this.remoteFamiliesDB = db;
  }
  public setLocalFamiliesDB(db: any) {
    this.localFamiliesDB = db;
  }

  // review db getters and setters
  public getRemoteReviewGroupsDB() {
    return this.remoteReviewGroupsDB;
  }
  public getLocalReviewGroupsDB() {
    return this.localReviewGroupsDB;
  }
  public setRemoteReviewGroupsDB(db: any) {
    this.remoteReviewGroupsDB = db;
  }
  public setLocalReviewGroupsDB(db: any) {
    this.localReviewGroupsDB = db;
  }
  // only to be done while online
  public initAndSyncData() {
    this.setRemoteFamiliesDB(new PouchDB(`${this.couchUri}families`));
    this.setRemoteFormsDB(new PouchDB(`${this.couchUri}forms`));
    this.setRemoteReviewGroupsDB(new PouchDB(`${this.couchUri}reviewgroups`));
    this.setLocalUserDB(new PouchDB(`${this.getName().toLowerCase()}`, { revs_limit: 1, auto_compaction: true }));
    this.getLocalUserDB().crypto(this.password, { ignore: "_attachments" });
    // this.setLocalFamiliesDB(new PouchDB(`${this.getName().toLowerCase()}_families`));
    // this.getLocalFamiliesDB().crypto(this.password, { ignore: '_attachments' });
    // this.setLocalFormsDB(new PouchDB(`${this.getName().toLowerCase()}_forms`));
    // this.getLocalFormsDB().crypto(this.password, { ignore: '_attachments' });
    // this.setLocalReviewGroupsDB(new PouchDB(`${this.getName().toLowerCase()}_reviewgroups`));
    // this.getLocalReviewGroupsDB().crypto(this.password, { ignore: '_attachments' });

    return this.getRemoteUserDB()
      .sync(this.getLocalUserDB())
      .then(() => {
        //after user dbs have synced
        //get remaining needed info from user db to populate the rest of the fields

        return this.getRemoteUserDB()
          .getUser(this.name)
          .then((user) => {
            if (user) {
              this.setID(user._id);
              this.setRev(user._rev);
              this.setFullname(user.fullname || "");
              this.setUserType(user.type);
              this.setReviewGroup(user.reviewGroup);
              return { conn: true, status: "ok", errors: null };
              // return this.getRemoteFamiliesDB()
              //   .sync(this.getLocalFamiliesDB())
              //   .then(() => {
              //     //after the families db sync
              //     return this.getRemoteFormsDB()
              //       .sync(this.getLocalFormsDB())
              //       .then(() => {
              //         //after forms db sync
              //         return this.remoteReviewGroupsDB
              //           .sync(this.getLocalReviewGroupsDB())
              //           .then(() => {
              //             return { conn: true, status: 'ok', errors: null };
              //           })
              //           .catch((err) => {
              //             let newError = { error: true, message: 'Review Groups databases failed to sync', stacktrace: err };
              //             this.errors.push(newError);
              //             // console.log(newError);
              //             return { conn: true, status: 'error', errors: this.errors };
              //           });
              //       })
              //       .catch((err) => {
              //         let newError = { error: true, message: 'Forms databases failed to sync', stacktrace: err };
              //         this.errors.push(newError);
              //         // console.log(newError);
              //         return { conn: true, status: 'error', errors: this.errors };
              //       });
              //   })
              //   .catch((err) => {
              //     let newError = { error: true, message: 'Families databases failed to sync', stacktrace: err };
              //     this.errors.push(newError);
              //     // console.log(newError);
              //     return { conn: true, status: 'error', errors: this.errors };
              //   });
            } else {
              let newError = { error: true, message: "Failed getting User from database", stacktrace: "In the else block of the if (user) when fetching users in user.ts initAndSyncData()" };
              this.errors.push(newError);
              // console.log(newError);
              return { conn: true, status: "error", errors: this.errors };
            }
          })
          .catch((err) => {
            // failed to login for some reason
            let newError = { error: true, message: "Failed getting User from database", stacktrace: err };
            this.errors.push(newError);
            // console.log(newError);
            return { conn: true, status: "error", errors: this.errors };
          });
      })
      .catch((err) => {
        let newError = { error: true, message: "User databases failed to sync", stacktrace: err };
        this.errors.push(newError);
        // console.log(newError);
        return { conn: true, status: "error", errors: this.errors };
      });
  }

  public initData() {
    this.localUserDB = new PouchDB(`${this.name.toLowerCase()}`);
    this.localUserDB.crypto(this.password, { ignore: "_attachments" });
    return this.localUserDB
      .getUser(this.name)
      .then((user) => {
        if (user) {
          this.setID(user._id);
          this.setRev(user._rev);
          this.setFullname(user.fullname || "");
          this.setUserType(user.type);
          this.localFamiliesDB = new PouchDB(`${this.name.toLowerCase()}_families`);
          this.localFamiliesDB.crypto(this.password, { ignore: "_attachments" });
          this.localFormsDB = new PouchDB(`${this.name.toLowerCase()}_forms`);
          this.localFormsDB.crypto(this.password, { ignore: "_attachments" });
          this.localReviewGroupsDB = new PouchDB(`this.name.toLowerCase()}_reviewgroups`);
          this.localReviewGroupsDB.crypto(this.password, { ignore: "_attachments" });
          return { status: "ok", username: this.getName(), password: this.getPassword(), errors: null };
        } else {
          let newError = { error: true, message: "Failed getting User from database", stacktrace: "In the else block of the if (user) when fetching users in user.ts initAndSyncData()" };
          this.errors.push(newError);
          // console.log(newError);
          return { conn: true, status: "error", errors: this.errors };
        }
      })
      .catch((err) => {
        let newError = { error: true, message: "Incorrect Username or Password", stacktrace: err };
        this.errors.push(newError);
        // console.log(newError);
        return { conn: false, status: "error", message: "Incorrect Username or Password", errors: this.errors };
      });
  }

  public syncDatabases(remoteDB, localDB) {}
  //private methods

  //static methods
  static toNewUserObj(user: User) {
    // used to submit an existing user for update
    return {
      _id: user.getID(),
      name: user.getName(),
      fullname: user.getFullname(),
      roles: user.getRoles(),
      reviewerGroups: user.getReviewerGroups(),
      wkoid: user.getWKOID(),
      type: user.getUserType(),
      password: user.getPassword(),
    };
  }
  static toUpdateUserObj(user: User) {
    // used to submit a new user
    return {
      _id: user.getID(),
      _rev: user.getRev(),
      name: user.getName(),
      fullname: user.getFullname(),
      roles: user.getRoles(),
      reviewerGroups: user.getReviewerGroups(),
      wkoid: user.getWKOID(),
      type: user.getUserType(),
    };
  }
  static toNewPasswordObject(user: User) {
    return {
      _id: user.getID(),
      _rev: user.getRev(),
      name: user.getName(),
      fullname: user.getFullname(),
      roles: user.getRoles(),
      reviewerGroups: user.getReviewerGroups(),
      wkoid: user.getWKOID(),
      type: user.getUserType(),
      password: user.getPassword(),
    };
  }
}
