import { Component, OnInit } from '@angular/core';
import { Query } from '../../../_types/query'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatabaseService } from '../../../_services/database.service'
import { FormGroupService } from '../../../_services/form-group-service.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {
  formOptions: Map<string, any>;
  constructor(
    private _db: DatabaseService, 
    private _fg: FormGroupService
    ) {}

  ngOnInit() {
    // have to figure out a way to handle being offline
    // this._db.getForms().then(formDocs => {
    //   if (!this.formOptions) {
    //     this.mapForms(formDocs);
    //   } 
    // })
  }

  onSelectChange() {
  
  }

  private mapForms(formDocs) {
    this.formOptions = new Map<string, any>();
    for(const doc of formDocs) {
      if (!this.formOptions.has(doc.form.name)) {
        this.formOptions.set(doc.form.name, doc);
      }
    }
  }
}
