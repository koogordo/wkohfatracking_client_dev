import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/_services/database.service';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
import { Router } from '@angular/router';
import { MatTableDataSource, MatSort, Sort, MatTable } from '@angular/material';
import { Form } from '../../_models/form';
import * as $PouchDB from 'pouchdb';
const PouchDB = $PouchDB['default'];
import * as $PouchFind from 'pouchdb-find';
const PouchFind = $PouchFind['default'];
import * as moment from 'moment';
const pouchCollate = require('pouchdb-collate');
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PregnancyReportHeaders, HvReportHeaders, HFAQuarterlyReportHeaders, DeltaGrantReportHeaders } from './report-builder/reportHeaders';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NamePipe } from '../../_pipes/name.pipe';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
})
export class ReportingComponent implements OnInit {
  archivedVisits;
  adultVisitDataSource: MatTableDataSource<Form>;
  childVisitDataSource: MatTableDataSource<Form>;
  missedVisitDataSource: MatTableDataSource<Form>;
  terminationDataSource: MatTableDataSource<Form>;
  parentSurveyDataSource: MatTableDataSource<Form>;
  contactLogDataSource: MatTableDataSource<Form>;
  clientActiveForms: MatTableDataSource<Form>;
  clientArchiveForms: MatTableDataSource<Form>;
  reportFG: FormGroup = new FormGroup({
    visitDateStart: new FormControl('', Validators.required),
    visitDateEnd: new FormControl('', Validators.required),
    initialVisitDateStart: new FormControl('', Validators.required),
    initialVisitDateEnd: new FormControl('', Validators.required),
  });

  clientLookUpForm: FormGroup = new FormGroup({
    query: new FormControl(),
  });
  activeVisits;
  archiveVisits;
  filterFG: FormGroup = new FormGroup({
    adultvisit: new FormControl(),
    childvisit: new FormControl(),
    closure: new FormControl(),
    parentsurvey: new FormControl(),
    missedvisit: new FormControl(),
    sortOrder: new FormControl(),
    os: new FormControl(),
  });
  client: any;
  family: any;
  displayedColumns;
  dataSourceFilters;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  constructor(private _db: DatabaseService, private _fg: FormGroupService, private _router: Router, private _namePipe: NamePipe) {
    PouchDB.plugin(PouchFind);
  }

  ngOnInit() {
    this.dataSourceFilters = ['Adult Visit', 'Child Visit', 'Closure Form', 'Missed Visit', 'Parent Survey'];

    this._db.getArchivedFormsByType().then((formArchivePayload) => {
      this.archivedVisits = formArchivePayload;
      this.displayedColumns = ['client', 'name', 'dateSubmitted', 'visitDate'];
      this.adultVisitDataSource = new MatTableDataSource<Form>(this.archivedVisits.adultVisits);
      this.childVisitDataSource = new MatTableDataSource<Form>(this.archivedVisits.childVisits);
      this.missedVisitDataSource = new MatTableDataSource<Form>(this.archivedVisits.missedVisits);
      this.terminationDataSource = new MatTableDataSource<Form>(this.archivedVisits.terminations);
      this.parentSurveyDataSource = new MatTableDataSource<Form>(this.archivedVisits.parentSurveys);
      this.contactLogDataSource = new MatTableDataSource<Form>(this.archivedVisits.contactLogs);
    });
  }
  onRowClicked(row) {
    this._router.navigate(['/formPdfView', row._id]);
  }
  sortDataSource($event) {
    console.log($event);
    console.log(this.clientActiveForms.data);
    switch ($event.direction) {
      case 'asc': {
        this.clientActiveForms.data.sort((a, b) => {
          const formAdate = moment((a as any).form[$event.active]);
          const formBdate = moment((b as any).form[$event.active]);

          if (formAdate.isBefore(formBdate)) {
            console.log('A before B');
            return -1;
          } else if (formBdate.isBefore(formAdate)) {
            console.log('B before A');
            return 1;
          } else {
            console.log('NO CHANGE');
            return 0;
          }
        });
        console.log(this.clientActiveForms.data);
        this.clientArchiveForms.data.sort((a, b) => {
          const formAdate = moment((a as any).form[$event.active]);
          const formBdate = moment((b as any).form[$event.active]);
          if (formAdate.isBefore(formBdate)) {
            return -1;
          } else if (formBdate.isBefore(formAdate)) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      case 'desc': {
        this.clientActiveForms.data.sort((a, b) => {
          const formAdate = moment((a as any).form[$event.active]);
          const formBdate = moment((b as any).form[$event.active]);
          if (formAdate.isAfter(formBdate)) {
            return -1;
          } else if (formBdate.isAfter(formAdate)) {
            return 1;
          } else {
            return 0;
          }
        });
        this.clientArchiveForms.data.sort((a, b) => {
          const formAdate = moment((a as any).form[$event.active]);
          const formBdate = moment((b as any).form[$event.active]);
          if (formAdate.isAfter(formBdate)) {
            return -1;
          } else if (formBdate.isAfter(formAdate)) {
            return 1;
          } else {
            return 0;
          }
        });
      }
    }
    this.table.renderRows();
  }
  registerFilterChanges() {
    let filters = JSON.parse(JSON.stringify(this.dataSourceFilters));
    const active = this.client.activeForms;
    const archive = this.client.archivedForms;
    this.filterFG.controls.adultvisit.valueChanges.subscribe((val) => {
      this.applyFilters(val, 'Adult Visit', filters, active, archive);
    });
    this.filterFG.controls.childvisit.valueChanges.subscribe((val) => {
      this.applyFilters(val, 'Child Visit', filters, active, archive);
    });
    this.filterFG.controls.closure.valueChanges.subscribe((val) => {
      this.applyFilters(val, 'Closure Form', filters, active, archive);
    });
    this.filterFG.controls.parentsurvey.valueChanges.subscribe((val) => {
      this.applyFilters(val, 'Parent Survey', filters, active, archive);
    });
    this.filterFG.controls.missedvisit.valueChanges.subscribe((val) => {
      this.applyFilters(val, 'Missed Visit', filters, active, archive);
    });
    this.filterFG.controls.os.valueChanges.subscribe((val) => {
      if (val !== '' && val.length > 2) {
        this.clientActiveForms = new MatTableDataSource(
          active
            .filter((form) => {
              return val === form.form.os;
            })
            .filter((form) => {
              for (const filter of filters) {
                if (filter === form.form.name) {
                  return true;
                }
              }
              return false;
            })
        );
        this.clientArchiveForms = new MatTableDataSource(
          archive
            .filter((form) => {
              return val === form.form.os;
            })
            .filter((form) => {
              for (const filter of filters) {
                if (filter === form.form.name) {
                  return true;
                }
              }
              return false;
            })
        );
      } else {
        this.clientActiveForms = new MatTableDataSource(
          active.filter((form) => {
            for (const filter of filters) {
              if (filter === form.form.name) {
                return true;
              }
            }
            return false;
          })
        );
        this.clientArchiveForms = new MatTableDataSource(
          archive.filter((form) => {
            for (const filter of filters) {
              if (filter === form.form.name) {
                return true;
              }
            }
            return false;
          })
        );
      }
    });
  }

  applyFilters(val, filter, filters, active, archive) {
    if (val) {
      if (filters.indexOf(filter) < 0) {
        filters.push(filter);
      }
      let checkCt = 0;
      for (const filterCheck in this.filterFG.controls) {
        if (this.filterFG.controls[filterCheck].value) {
          checkCt++;
        }
      }
      if (checkCt == 1) {
        filters = [filter];
      }
    } else {
      if (filters.indexOf(filter) >= 0) {
        filters.splice(filters.indexOf(filter), 1);
      }
      let resetFilters = true;
      for (const filterCheck in this.filterFG.controls) {
        if (this.filterFG.controls[filterCheck].value) {
          resetFilters = false;
        }
      }
      if (resetFilters) {
        filters = JSON.parse(JSON.stringify(this.dataSourceFilters));
      }
    }

    this.clientActiveForms = new MatTableDataSource(
      active.filter((form) => {
        for (const filter of filters) {
          if (filter === form.form.name) {
            return true;
          }
        }
        return false;
      })
    );
    this.clientArchiveForms = new MatTableDataSource(
      archive.filter((form) => {
        for (const filter of filters) {
          if (filter === form.form.name) {
            return true;
          }
        }
        return false;
      })
    );
  }
  viewForm(row) {
    console.log(row);
  }
  generatePregnancyReport() {
    this.pregnancyReport(
      this.reportFG.controls.visitDateStart.value,
      this.reportFG.controls.visitDateEnd.value,
      this.reportFG.controls.initialVisitDateStart.value,
      this.reportFG.controls.initialVisitDateEnd.value
    );
  }

  generateHvReport() {
    this.hvReport(
      this.reportFG.controls.visitDateStart.value,
      this.reportFG.controls.visitDateEnd.value,
      this.reportFG.controls.initialVisitDateStart.value,
      this.reportFG.controls.initialVisitDateEnd.value
    );
  }

  generateHFAQuarterlyReport() {
    this.HFAQuarterlyReport(
      this.reportFG.controls.visitDateStart.value,
      this.reportFG.controls.visitDateEnd.value,
      this.reportFG.controls.initialVisitDateStart.value,
      this.reportFG.controls.initialVisitDateEnd.value
    );
  }

  generateDeltaGrantReport() {
    this.deltaGrantReport(
      this.reportFG.controls.visitDateStart.value,
      this.reportFG.controls.visitDateEnd.value,
      this.reportFG.controls.initialVisitDateStart.value,
      this.reportFG.controls.initialVisitDateEnd.value
    );
  }

  pregnancyReport(visitDateStart, visitDateEnd, initialVisitDateStart, initialVisitDateEnd) {
    const filteredRows = this.archivedVisits.adultVisits.filter((visit) => {
      if (visit) {
        visitDateStart = moment(visitDateStart);
        visitDateEnd = moment(visitDateEnd);
        initialVisitDateStart = moment(initialVisitDateStart);
        initialVisitDateEnd = moment(initialVisitDateEnd);
        const visitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Visit Date');
        const visitDateQuestion = this._fg.findFormPartByIndex(visit.form, visitDateIndex);
        const initialVisitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Initial Visit Date');
        const initialVisitDateQuestion = this._fg.findFormPartByIndex(visit.form, initialVisitDateIndex);
        const visitDate = moment(visitDateQuestion.input);
        const initialVisitDate = moment(initialVisitDateQuestion.input) || visitDate;
        return (
          (visitDate.isSameOrAfter(visitDateStart) && visitDate.isBefore(visitDateEnd)) || (initialVisitDate.isSameOrAfter(initialVisitDateStart) && initialVisitDate.isBefore(initialVisitDateEnd))
        );
      }
    });

    const ResultSet = [];
    const promises = [];
    for (const doc of filteredRows) {
      let Row: any = {};
      Row['FamilyID'] = pouchCollate.parseIndexableString(decodeURI(doc.form.client))[0];
      Row['ClientID'] = doc.form.client;
      promises.push(
        this._db.getClient(pouchCollate.parseIndexableString(decodeURI(doc.form.client))).then((client) => {
          this._db.getForm(doc.form.formID).then((templateForm) => {
            Row['First Name'] = this._namePipe.transform(client.clientFName);
            Row['Last Name'] = this._namePipe.transform(client.clientLName);
            const expandedForm = this._fg.expand(templateForm, doc.form);
            for (const reportHeader of PregnancyReportHeaders) {
              const index = this._fg.indexQuestionGroup(expandedForm, reportHeader.key);
              let question;
              if (index) {
                question = this._fg.findFormPartByIndex(expandedForm, index);
                Row[reportHeader.header] = question.input;
              } else {
                Row[reportHeader.header] = '';
              }
            }
            ResultSet.push(Row);
            Row = null;
          });
        })
      );
    }
    Promise.all(promises).then(() => {
      this.createExcel(ResultSet, 'PregnancyReport');
    });
  }

  hvReport(visitDateStart, visitDateEnd, initialVisitDateStart, initialVisitDateEnd) {
    const promises = [];
    // Filter apporopriate adult rows
    const adultFilteredRows = this.archivedVisits.adultVisits.filter((visit) => {
      if (visit) {
        visitDateStart = moment(visitDateStart);
        visitDateEnd = moment(visitDateEnd);
        initialVisitDateStart = moment(initialVisitDateStart);
        initialVisitDateEnd = moment(initialVisitDateEnd);
        const visitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Visit Date');
        const visitDateQuestion = this._fg.findFormPartByIndex(visit.form, visitDateIndex);
        const initialVisitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Initial Visit Date');
        const initialVisitDateQuestion = this._fg.findFormPartByIndex(visit.form, initialVisitDateIndex);
        const visitDate = moment(visitDateQuestion.input);
        const initialVisitDate = moment(initialVisitDateQuestion.input) || visitDate;
        return (
          (visitDate.isSameOrAfter(visitDateStart) && visitDate.isBefore(visitDateEnd)) || (initialVisitDate.isSameOrAfter(initialVisitDateStart) && initialVisitDate.isBefore(initialVisitDateEnd))
        );
      }
    });
    // filter appropriate child rows
    const childFilteredRows = this.archivedVisits.childVisits.filter((visit) => {
      if (visit) {
        visitDateStart = moment(visitDateStart);
        visitDateEnd = moment(visitDateEnd);
        initialVisitDateStart = moment(initialVisitDateStart);
        initialVisitDateEnd = moment(initialVisitDateEnd);
        const visitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Visit Date');
        const visitDateQuestion = this._fg.findFormPartByIndex(visit.form, visitDateIndex);
        const initialVisitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Initial Visit Date');
        const initialVisitDateQuestion = this._fg.findFormPartByIndex(visit.form, initialVisitDateIndex);
        const visitDate = moment(visitDateQuestion.input);
        const initialVisitDate = moment(initialVisitDateQuestion.input) || visitDate;
        return (
          (visitDate.isSameOrAfter(visitDateStart) && visitDate.isBefore(visitDateEnd)) || (initialVisitDate.isSameOrAfter(initialVisitDateStart) && initialVisitDate.isBefore(initialVisitDateEnd))
        );
      }
    });

    // create adult result set
    const AdultResultSet = [];
    for (const doc of adultFilteredRows) {
      let AdultRow: any = {};
      AdultRow['FamilyID'] = pouchCollate.parseIndexableString(decodeURI(doc.form.client))[0];
      AdultRow['ClientID'] = doc.form.client;
      promises.push(
        this._db.getClient(pouchCollate.parseIndexableString(decodeURI(doc.form.client))).then((client) => {
          this._db.getForm(doc.form.formID).then((templateForm) => {
            AdultRow['First Name'] = this._namePipe.transform(client.clientFName);
            AdultRow['Last Name'] = this._namePipe.transform(client.clientLName);
            const expandedForm = this._fg.expand(templateForm, doc.form);
            const ssnIndex = this._fg.indexQuestionGroup(client.form, 'SSN');
            const ssnQuestion = this._fg.findFormPartByIndex(doc.form, ssnIndex);
            AdultRow['SSN'] = ssnQuestion.input;
            for (const reportHeader of HvReportHeaders) {
              const index = this._fg.indexQuestionGroup(expandedForm, reportHeader.key);
              let question;
              if (index) {
                question = this._fg.findFormPartByIndex(expandedForm, index);
                AdultRow[reportHeader.header] = question.input;
              } else {
                AdultRow[reportHeader.header] = '';
              }
            }
            AdultResultSet.push(AdultRow);
            AdultRow = null;
          });
        })
      );
    }
    // create child result set
    const ChildResultSet = [];
    for (const doc of childFilteredRows) {
      let ChildRow: any = {};
      ChildRow['FamilyID'] = pouchCollate.parseIndexableString(decodeURI(doc.form.client))[0];
      ChildRow['ClientID'] = doc.form.client;
      promises.push(
        this._db.getClient(pouchCollate.parseIndexableString(decodeURI(doc.form.client))).then((client) => {
          this._db.getForm(doc.form.formID).then((templateForm) => {
            ChildRow['First Name'] = this._namePipe.transform(client.clientFName);
            ChildRow['Last Name'] = this._namePipe.transform(client.clientLName);
            const expandedForm = this._fg.expand(templateForm, doc.form);
            const ssnIndex = this._fg.indexQuestionGroup(client.form, 'SSN');
            const ssnQuestion = this._fg.findFormPartByIndex(client.form, ssnIndex);
            ChildRow['SSN'] = ssnQuestion.input;
            for (const reportHeader of HvReportHeaders) {
              const index = this._fg.indexQuestionGroup(expandedForm, reportHeader.key);
              let question;
              if (index) {
                question = this._fg.findFormPartByIndex(expandedForm, index);
                ChildRow[reportHeader.header] = question.input;
              } else {
                ChildRow[reportHeader.header] = '';
              }
            }
            ChildResultSet.push(ChildRow);
            ChildRow = null;
          });
        })
      );
    }

    // once all child and adult promises are complete then creat excel
    Promise.all(promises).then(() => {
      const unionedResults = AdultResultSet.concat(ChildResultSet);
      this.createExcel(unionedResults, 'HvReport');
    });
  }

  HFAQuarterlyReport(visitDateStart, visitDateEnd, initialVisitDateStart, initialVisitDateEnd) {
    const filteredRows = this.archivedVisits.adultVisits.filter((visit) => {
      if (visit) {
        visitDateStart = moment(visitDateStart);
        visitDateEnd = moment(visitDateEnd);
        initialVisitDateStart = moment(initialVisitDateStart);
        initialVisitDateEnd = moment(initialVisitDateEnd);
        const visitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Visit Date');
        const visitDateQuestion = this._fg.findFormPartByIndex(visit.form, visitDateIndex);
        const initialVisitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Initial Visit Date');
        const initialVisitDateQuestion = this._fg.findFormPartByIndex(visit.form, initialVisitDateIndex);
        const visitDate = moment(visitDateQuestion.input);
        const initialVisitDate = moment(initialVisitDateQuestion.input) || visitDate;
        return (
          (visitDate.isSameOrAfter(visitDateStart) && visitDate.isBefore(visitDateEnd)) || (initialVisitDate.isSameOrAfter(initialVisitDateStart) && initialVisitDate.isBefore(initialVisitDateEnd))
        );
      }
    });

    const ResultSet = [];
    const promises = [];
    for (const doc of filteredRows) {
      let Row: any = {};
      Row['FamilyID'] = pouchCollate.parseIndexableString(decodeURI(doc.form.client))[0];
      Row['ClientID'] = doc.form.client;
      promises.push(
        this._db.getClient(pouchCollate.parseIndexableString(decodeURI(doc.form.client))).then((client) => {
          this._db.getForm(doc.form.formID).then((templateForm) => {
            Row['First Name'] = this._namePipe.transform(client.clientFName);
            Row['Last Name'] = this._namePipe.transform(client.clientLName);
            const expandedForm = this._fg.expand(templateForm, doc.form);
            for (const reportHeader of HFAQuarterlyReportHeaders) {
              const index = this._fg.indexQuestionGroup(expandedForm, reportHeader.key);
              let question;
              if (index) {
                question = this._fg.findFormPartByIndex(expandedForm, index);
                Row[reportHeader.header] = question.input;
              } else {
                Row[reportHeader.header] = '';
              }
            }
            ResultSet.push(Row);
            Row = null;
          });
        })
      );
    }
    Promise.all(promises).then(() => {
      this.createExcel(ResultSet, 'HFAQuarterlyReport');
    });
  }

  deltaGrantReport(visitDateStart, visitDateEnd, initialVisitDateStart, initialVisitDateEnd) {
    const filteredRows = this.archivedVisits.adultVisits.filter((visit) => {
      if (visit) {
        visitDateStart = moment(visitDateStart);
        visitDateEnd = moment(visitDateEnd);
        initialVisitDateStart = moment(initialVisitDateStart);
        initialVisitDateEnd = moment(initialVisitDateEnd);
        const visitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Visit Date');
        const visitDateQuestion = this._fg.findFormPartByIndex(visit.form, visitDateIndex);
        const initialVisitDateIndex = this._fg.indexQuestionGroup(visit.form, 'Initial Visit Date');
        const initialVisitDateQuestion = this._fg.findFormPartByIndex(visit.form, initialVisitDateIndex);
        const visitDate = moment(visitDateQuestion.input);
        const initialVisitDate = moment(initialVisitDateQuestion.input) || visitDate;
        return (
          (visitDate.isSameOrAfter(visitDateStart) && visitDate.isBefore(visitDateEnd)) || (initialVisitDate.isSameOrAfter(initialVisitDateStart) && initialVisitDate.isBefore(initialVisitDateEnd))
        );
      }
    });

    const ResultSet = [];
    const promises = [];
    for (const doc of filteredRows) {
      let Row: any = {};
      Row['FamilyID'] = pouchCollate.parseIndexableString(decodeURI(doc.form.client))[0];
      Row['ClientID'] = doc.form.client;
      promises.push(
        this._db.getClient(pouchCollate.parseIndexableString(decodeURI(doc.form.client))).then((client) => {
          this._db.getForm(doc.form.formID).then((templateForm) => {
            Row['First Name'] = this._namePipe.transform(client.clientFName);
            Row['Last Name'] = this._namePipe.transform(client.clientLName);
            const expandedForm = this._fg.expand(templateForm, doc.form);
            for (const reportHeader of DeltaGrantReportHeaders) {
              const index = this._fg.indexQuestionGroup(expandedForm, reportHeader.key);
              let question;
              if (index) {
                question = this._fg.findFormPartByIndex(expandedForm, index);
                Row[reportHeader.header] = question.input;
              } else {
                Row[reportHeader.header] = '';
              }
            }
            ResultSet.push(Row);
            Row = null;
          });
        })
      );
    }
    Promise.all(promises).then(() => {
      this.createExcel(ResultSet, 'DealtaGrantReport');
    });
  }

  createExcel(resultSet, excelFileName) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(resultSet);

    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });

    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // code for looking up a client
  onLookUpSubmit() {
    const query = this.clientLookUpForm.controls.query.value;
    const splitQuery: any[] = query.split('');
    let parsedID;
    let familyID;
    let familyName;
    if (splitQuery.indexOf('-') >= 0) {
      parsedID = query.split('-');
      this.setClient(parsedID);
    } else if (splitQuery.length === 4 && !isNaN(query)) {
      familyID = query;
      this.setFamily(familyID);
    } else if (splitQuery.indexOf('%') >= 0) {
      parsedID = pouchCollate.parseIndexableString(decodeURI(query));
      this.setClient(parsedID);
    } else if (isNaN(query)) {
      familyName = query.toLowerCase().trim();

      this.setFamilyByName(familyName);
    }
  }

  setClient(parsedID) {
    this._db.getClient(parsedID).then((client) => {
      this.client = {};
      this.client.firstName = client.clientFName;
      this.client.lastName = client.clientLName;
      this._db.getAllClientVisitsIgnoreType(encodeURI(pouchCollate.toIndexableString(parsedID))).then((formPayload) => {
        this.client.activeForms = formPayload;
        this._db.getAllClientArchivedVisitsIgnoreType(encodeURI(pouchCollate.toIndexableString(parsedID))).then((formPayload) => {
          this.client.archivedForms = formPayload;
          this.clientActiveForms = new MatTableDataSource(
            this.client.activeForms.map((formDoc) => {
              const parsed = pouchCollate.parseIndexableString(decodeURI(formDoc.form.client));
              formDoc.form.client = `${parsed[0]}-${parsed[1]}-${parsed[2]}`;
              return formDoc;
            })
          );
          this.clientArchiveForms = new MatTableDataSource(
            this.client.archivedForms.map((formDoc) => {
              const parsed = pouchCollate.parseIndexableString(decodeURI(formDoc.form.client));
              formDoc.form.client = `${parsed[0]}-${parsed[1]}-${parsed[2]}`;
              return formDoc;
            })
          );
          this.clientActiveForms.sortingDataAccessor = (item: any, property) => {
            switch (property) {
              case 'form.dateSubmitted':
                return item.form.name;
              case 'form.visitDate':
                return item.form.visitDate;
              default:
                return item[property];
            }
          };
          this.clientArchiveForms.sortingDataAccessor = (item: any, property) => {
            switch (property) {
              case 'form.dateSubmitted':
                return item.form.name;
              case 'form.visitDate':
                return item.form.visitDate;
              default:
                return item[property];
            }
          };
          this.clientActiveForms.sort = this.sort;
          this.clientArchiveForms.sort = this.sort;
          this.registerFilterChanges();
        });
      });
    });
  }

  setFamily(familyID) {
    this._db.getAllFamilyVisits(familyID).then((familyPayload) => {
      this.family = familyPayload;
    });
  }

  setFamilyByName(familyName) {
    this._db.getFamilyByPrimaryName(familyName).then((payload) => {
      this._db.getAllFamilyVisits(payload.rows[0].doc._id).then((familyPayload) => {
        this.family = familyPayload;
      });
    });
  }

  getFormDate(form) {
    var id = pouchCollate.parseIndexableString(decodeURI(form._id));
    return moment(id[3]).format('DD MMM YYYY');
  }
}
