import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import CryptoPouch from "crypto-pouch";
import * as $PouchDB from "pouchdb";
const PouchDB = $PouchDB["default"];
import * as $PouchAuth from "pouchdb-authentication";
const PouchAuth = $PouchAuth["default"];
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DatabaseService } from "../_services/database.service";
import { CookieService } from "ngx-cookie-service";
import { User } from "../_types/user";
import { ConnectionService } from "../_services/connection.service";
import { UserIdleService } from "angular-user-idle";
import { MatDialog } from "@angular/material";
import { IdleDialogComponent } from "../components/idle-dialog/idle-dialog.component";
import { ClientSocketService } from "../_services/client-socket.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  type = "password";
  loginError = "";
  loading = false;
  returnUrl: string;
  online;
  errors;
  couchUri = "https://www.hfatracking.net/couchdb/";
  loginFG = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl(""),
  });

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private connectionService: ConnectionService,
    private _userIdle: UserIdleService,
    private _matDialog: MatDialog,
    private _socket: ClientSocketService
  ) {
    PouchDB.plugin(PouchAuth);
    PouchDB.plugin(CryptoPouch);
    this.errors = [];
  }

  ngOnInit() {
    this._userIdle.onTimerStart().subscribe((count) => {});
    this._userIdle.onTimeout().subscribe(() => {
      this.databaseService.setLogout();
    });
    this.connectionService.connection().subscribe((connection) => {
      this.online = connection;
      this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
      if (this.cookieService.check("login")) {
        this.initLogin();
      }
    });
  }

  initLogin(event: any = null) {
    if (event) {
      this.login(this.loginFG);
    } else {
      this.login();
    }
  }

  /*
  login
    check if online
      online
        check login info with couchdb
          correct
            login succeeds
           incorrect
            wrong credentials
      offline
        check if localdb exists
          yes
            check if password decrypts localdb
              yes
                login succeeds
              no
                wrong password
          no
            no localdb for user, need to connect to internet
   */
  login(loginFG: FormGroup = null) {
    let user: { username: string; password: string; dbname: string };
    if (loginFG) {
      user = {
        username: loginFG.value.username,
        password: loginFG.value.password,
        dbname: loginFG.value.username.toLowerCase(),
      };
    } else {
      if (this.cookieService.check("login")) {
        const loginCookie = JSON.parse(this.cookieService.get("login"));
        user = {
          username: loginCookie.username,
          password: loginCookie.password,
          dbname: loginCookie.username.toLowerCase(),
        };
      }
    }

    if (this.online) {
      const loginDB = new PouchDB(`${this.couchUri}${user.dbname}`);
      loginDB
        .logIn(user.username, user.password)
        .then((loginResult) => {
          if (loginResult) {
            const activeUser = new User(loginResult.name, user.password, loginResult.roles, loginDB);
            this.loading = true;
            activeUser.initAndSyncData().then((result) => {
              if (result.status === "ok") {
                this.databaseService.setLoginCookie({ username: user.username, password: user.password });
                this.connectSocket(activeUser.getName());
                this.databaseService.setLogin(activeUser);
                this._userIdle.startWatching();
                this.router.navigateByUrl(this.returnUrl);
              } else {
                console.error(result.errors);
                this.loading = false;
              }
            });
          }
        })
        .catch((err) => {
          this.loginError = err.message;
          console.error(`Login on login DB failed :: ${err.message}`);
        });
    } else {
      const activeUser = new User(user.username, user.password);
      this.loading = true;
      activeUser.initData().then((result) => {
        if (result.status === "ok") {
          //if (!this.cookieService.check('login')) {
          this.databaseService.setLoginCookie({ username: user.username, password: user.password });
          //}
          this.databaseService.setLogin(activeUser);
          this._userIdle.startWatching();
          this.router.navigateByUrl(this.returnUrl);
        } else {
          console.error(result.errors);
          this.loading = false;
        }
      });
    }
  }
  connectSocket(user) {
    if (!this._socket.getInstance()) {
      this._socket.createInstance(`org.couchdb.user:${user}`);
    }
  }
}
