import { Component, OnInit } from '@angular/core';
import { Form } from '../_models/form';
import { DatabaseService } from '../_services/database.service';
import { Router, ActivatedRoute } from '@angular/router';
import { query } from '@angular/core/src/render3';
import { ConnectionService } from '../_services/connection.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  storedForms: Form[];
  loginStatus;
  roles;
  blankForms;
  clientFamilies;
  allForms;
  isAdmin;
  isOS;
  isReviewer;
  user;
  activeUsername;
  queryParams;
  newFamilyForm;
  manageReviewGroupForm;
  allReviewGroups;
  allUsers;
  buttonsOnline;
  constructor(private formService: DatabaseService, private router: Router, private route: ActivatedRoute, private _conn: ConnectionService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      this.queryParams = queryParams;
    });
    this.buttonsOnline = this._conn.connection().getValue();
    setInterval(() => {
      this.buttonsOnline = this._conn.connection().getValue();
    }, 5000);
    this.formService.activeUser.subscribe((res) => {
      if (res) {
        const osAndReviewGroupPromises = [this.formService.getReviewGroups(), this.formService.getUsers()];
        Promise.all(osAndReviewGroupPromises).then(([reviewGroupDocs, userDocs]) => {
          this.allReviewGroups = reviewGroupDocs;
          this.allUsers = userDocs;
          // console.log(this.allReviewGroups);
          // console.log(this.allUsers);
        });
        this.user = res;
        this.activeUsername = this.user.getName();
        this.loginStatus = true;
        this.roles = res.getRoles();
        this.formService
          .getForms()
          .then((forms) => {
            this.allForms = forms;
            this.manageReviewGroupForm = this.allForms
              .map((form) => {
                return form;
              })
              .filter((form) => {
                return form.form.name === 'Add Review Group';
              })[0];
          })
          .catch((err) => console.log('This is the error: ' + err));
        this.formService.forms.subscribe((forms) => {
          this.blankForms = forms;
          this.blankForms.map((form) => {
            if (!this.newFamilyForm && form.form.name === 'New Family') {
              this.newFamilyForm = form;
            }
          });
          this.addAllowedClientsProperty();
          if (this.clientFamilies) {
            this.setAllowedClients(this.clientFamilies);
          }
        });
        this.isAdmin = this.roles.indexOf('_admin') >= 0 ? true : false;
        this.isOS = this.roles.indexOf('OS') >= 0 ? true : false;
        this.isReviewer = this.roles.indexOf('REVIEWER') >= 0 ? true : false;
        if (this.isOS) {
          this.formService.getFamiliesWithForms().then((families) => {
            this.clientFamilies = families;
            if (this.blankForms) {
              this.setAllowedClients(JSON.parse(JSON.stringify(families)));
            }
          });
        }
      } else {
        this.loginStatus = false;
        this.roles = [];
      }
    });
  }

  logout() {
    this.formService.setLogout();
  }

  setAllowedClients(families) {
    for (let index in this.blankForms) {
      this.blankForms[index].allowedClients = this.formService.getAllowedClientsForForm(this.blankForms[index].form, families);
    }
  }

  addAllowedClientsProperty() {
    for (let form of this.blankForms) {
      form.allowedClients = [];
    }
  }
}
