import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../_services/database.service';
import { Form } from '../_models/form';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { Router } from '@angular/router';
declare var require: any;
var pouchCollate = require('pouchdb-collate');
import * as moment from 'moment';
import * as $PouchDB from 'pouchdb';
const PouchDB = $PouchDB['default'];
import * as $PouchAuth from 'pouchdb-authentication';
import { FormGroupService } from '../_services/form-group-service.service';
const PouchAuth = $PouchAuth['default'];
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  subForms;
  storedForms;
  dataSource: MatTableDataSource<Form>;
  displayedColumns;
  queuedForms;
  clients;
  localArchiveDB;
  remoteArchiveDB;
  constructor(private formService: DatabaseService, private router: Router, private _fgs: FormGroupService) {
    this.formService.getSubmittedForms().then((subForms) => {
      var forms = subForms.map((subForm) => {
        subForm.form.visitDate = subForm.form.tabs[0].sections[0].rows[0].columns[1].questions[0].input;
        subForm.form.id = subForm._id;

        if (subForm.form.dateSubmittedForReview.length != 0) {
          subForm.form.dateSubmitted = subForm.form.dateSubmittedForReview.pop();
          return subForm.form;
        } else return null;
      });
      forms = forms.filter(function(item) {
        return item != null;
      });
      this.subForms = forms;
      this.displayedColumns = ['os', 'client', 'name', 'dateSubmitted', 'visitDate'];
      this.dataSource = new MatTableDataSource<Form>(this.subForms);
    });
    this.formService.forms.subscribe((forms) => {
      this.storedForms = forms;
    });
    this.formService.updateForms();
    this.formService.updateSubForms();
    // this.formService.getClients().then(clients =>{
    //   this.clients = clients;
    // });
  }

  ngOnInit() {
    this.formService.getAllQueuedForms().then((forms) => {
      // const temp = []
      // forms.map(form => {
      //   const dateIndex = this._fgs.indexQuestionGroup(form.form, 'Visit Date')
      //   form.form.dateSubmitted = moment(form.form.status[form.form.status.length - 1].date).format('MMM DD YYYY');
      //   form.form.visitDate = moment(form.form.tabs[0].sections[0].rows[0].columns[0].questions[0].value).format('MMM DD YYYY');
      //   form.form.client = pouchCollate.parseIndexableString(decodeURI(form.form.client));
      //   temp.push(form);
      // })
      this.queuedForms = forms;
      this.dataSource = new MatTableDataSource<Form>(this.queuedForms);
    });
    const user = this.formService.activeUser.getValue();
    this.remoteArchiveDB = new PouchDB('https://www.hfatracking.net/couchdb/formarchive');
    this.localArchiveDB = new PouchDB(`${user.getName().toLowerCase()}_formarchive`);
    this.remoteArchiveDB.sync(this.localArchiveDB).then(() => {
      console.log('Archive DBS synced for admin');
    });
  }

  onRowClicked(row) {
    this.router.navigate(['/adminViewForm', row._id], { queryParams: { OS: row.form.os } });
  }

  sortData(sort: Sort) {
    this.dataSource.sort = this.sort;
  }

  applyClientFilter(filterValue) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (filter == '0') {
        return true;
      } else {
        return data.client == filter;
      }
    };
    this.dataSource.filter = filterValue;
  }
  applyOSFilter(filterValue) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (filter == '0') {
        return true;
      } else {
        return data.client == filter;
      }
    };
    this.dataSource.filter = filterValue;
  }
}
