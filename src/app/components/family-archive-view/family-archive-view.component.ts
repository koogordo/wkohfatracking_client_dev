import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/database.service';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { query } from '@angular/animations';
import {MatSort, MatTableDataSource, Sort, MatDialog} from "@angular/material";
import {Form} from "../../_models/form";
import { PreviewFormComponent } from '../../components/preview-form/preview-form.component'
@Component({
  selector: 'app-family-archive-view',
  templateUrl: './family-archive-view.component.html',
  styleUrls: ['./family-archive-view.component.scss']
})
export class FamilyArchiveViewComponent implements OnInit {
  familyArchive: FamilyArchive;
  routeParams$: any;
  queryParams: any;
  adultVisitDataSource: MatTableDataSource<Form>;
  childVisitDataSource: MatTableDataSource<Form>;
  missedVisitDataSource: MatTableDataSource<Form>;
  terminationDataSource: MatTableDataSource<Form>;
  parentSurveyDataSource: MatTableDataSource<Form>;
  contactLogDataSource: MatTableDataSource<Form>;
  displayedColumns;
  constructor(
    private databaseService: DatabaseService,
    private formGroupService: FormGroupService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
   this.routeParams$ = combineLatest(this.route.params, this.route.queryParams);
   this.routeParams$.subscribe(([params, queryParams]) => {
    // console.log(params['id'], queryParams['osID']);
     this.databaseService.getArchivedFormsForFamily(params['id'], queryParams['osID']).then(payload => {
      // console.log(payload);
       this.familyArchive = payload;
       this.displayedColumns = ['os','client', 'name','dateSubmitted','visitDate'];
       this.adultVisitDataSource = new MatTableDataSource<Form>(this.familyArchive.adultVisits);
       this.childVisitDataSource = new MatTableDataSource<Form>(this.familyArchive.childVisits);
       this.missedVisitDataSource = new MatTableDataSource<Form>(this.familyArchive.missedVisits);
       this.terminationDataSource = new MatTableDataSource<Form>(this.familyArchive.terminations);
       this.parentSurveyDataSource = new MatTableDataSource<Form>(this.familyArchive.parentSurveys);
       this.contactLogDataSource = new MatTableDataSource<Form>(this.familyArchive.contactLogs);
     })
   })
  }

  onRowClicked(row) {
    // console.log(row);
    this.router.navigate(['/adminViewForm', row._id], {queryParams: {OS: row.form.os, permanentView: true}})
  }
  sortData(sort: Sort){
    
  }

  openPreviewDialog(form) {
    let returnForm;
    if (this.formGroupService.formGroupBS && this.formGroupService.formGroupBS.getValue().getRawValue()) {
      returnForm = this.formGroupService.formGroupBS.getValue().getRawValue();
    } else {
      returnForm = null;
    }
    let dialogRef = this.dialog.open(PreviewFormComponent, {
      width: '90%',
      position: {
        top: '10%',
        left: '10%'
      },
      data: { formGroup: Object.assign({}, form.form), returnForm}
    });
    dialogRef.afterClosed().subscribe(returnForm => {
      if (returnForm) {
        const tempReturnForm = this.formGroupService.buildFormGroup(returnForm);
        this.formGroupService.formGroupBS.next(tempReturnForm);
      }
    })
  }
}

export interface FamilyArchive {
  familyID: string;
  osID: string;
  adultVisits: any[];
  childVisits: any[];
  contactLogs: any[];
  parentSurveys: any[];
  terminations: any[];
  missedVisits: any[];
}