import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../_services/database.service';
import { FormControl } from '@angular/forms';
import { FormGroupService } from '../_services/form-group-service.service';
import { PreviewFormComponent } from '../components/preview-form/preview-form.component';
import { MatDialog, MatSelectionList, MatTableDataSource } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
})
export class LookupComponent implements OnInit {
  storedForms;
  chosenFormFC = new FormControl({});
  chosenFormFG;
  chosenKeys = [];
  selectedAndChosenKeys = [];

  beforeDateFC = new FormControl();
  afterDateFC = new FormControl();

  @ViewChild(MatSelectionList) list;
  sub = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([{ Date: '' }]);
  displayedColumns;
  constructor(private formService: DatabaseService, private formGroupService: FormGroupService, public dialog: MatDialog) {
    this.formService.forms.subscribe((forms) => {
      this.storedForms = forms;
    });
    this.formService.updateForms();
  }

  ngOnInit() {}

  chooseForm() {
    this.chosenFormFG = this.formGroupService.buildFormGroup(this.chosenFormFC.value.form);
    this.formGroupService.updateFormGroup(this.chosenFormFG);
    this.chosenKeys = [];
    this.sub = false;
  }

  openPreview() {
    return this.dialog.open(PreviewFormComponent, {
      width: '90%',
      position: {
        top: '10%',
        left: '10%',
      },
      data: { formGroup: Object.assign({}, this.chosenFormFG.value), keys: this.chosenKeys },
    });
  }

  selectKeys() {
    var prev = this.openPreview();
    const sub = prev.componentInstance.onSel.subscribe((next) => {
      this.chosenKeys = next;
    });

    prev.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  getType(index) {
    return this.formGroupService.getQuestionGroupByIndex(index).value.type;
  }

  getForms() {
    var selectedKeys = this.list.selectedOptions.selected.map((row) => {
      return row.value;
    });
    selectedKeys = selectedKeys.concat(this.chosenKeys);
    selectedKeys.sort((a, b) => {
      if (a.index !== 'metadata' && b.index === 'metadata') {
        return 1;
      } else if (a.index === 'metadata' && b.index !== 'metadata') {
        return -1;
      } else {
        if (a.key < b.key) {
          return -1;
        } else {
          return 1;
        }
      }
    });
    this.selectedAndChosenKeys = selectedKeys;
    // this.formService.getValuesFromSubForms(selectedKeys).then((next) => {
    //   var filtered = next;
    //   if (this.beforeDateFC.value) {
    //     filtered = this.beforeDate(this.beforeDateFC.value, filtered, 'Date');
    //   }

    //   if (this.afterDateFC.value) {
    //     filtered = this.afterDate(this.afterDateFC.value, filtered, 'Date');
    //   }

    //   this.dataSource = new MatTableDataSource<any>(filtered);
    //   this.displayedColumns = [];
    //   for (let key of selectedKeys) {
    //     this.displayedColumns.push(key.key);
    //   }
    //   this.sub = true;
    // });
  }

  removeKey(key) {
    this.chosenKeys = this.chosenKeys.filter((obj) => {
      return obj.key !== key;
    });
  }

  beforeDate(date, array, key) {
    return array.filter((el) => {
      if (moment(el[key]).isBefore(date)) {
        return true;
      } else {
        return false;
      }
    });
  }

  afterDate(date, array, key) {
    return array.filter((el) => {
      if (moment(el[key]).isAfter(date)) {
        return true;
      } else {
        return false;
      }
    });
  }
}
