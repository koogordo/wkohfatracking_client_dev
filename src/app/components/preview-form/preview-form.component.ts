import { Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroupService } from '../../_services/form-group-service.service';
import { CLIENT_RENEG_WINDOW } from 'tls';

@Component({
  selector: 'app-preview-form',
  templateUrl: './preview-form.component.html',
  styleUrls: ['./preview-form.component.scss'],
})
export class PreviewFormComponent implements OnInit {
  @ViewChild('cardView') cardViewRef: ElementRef;
  formGroup;
  selIndex;
  keys = [];
  num;
  onSel = new EventEmitter();
  previewMode;
  clientID;
  constructor(private formGroupService: FormGroupService, public dialogRef: MatDialogRef<PreviewFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.previewMode = true;

    this.clientID = this.data.formGroup.client;
    console.log(this.data.formGroup);
    this.formGroup = this.formGroupService.buildFormGroup(this.data.formGroup);
    this.formGroupService.setInitialLoadFlagsOnQuestions(this.formGroup, false);
    // this.formGroupService.prevFormGroupBS.next(this.formGroup);
    if (this.data['keys']) {
      this.keys = this.data.keys;
    }
    if (this.data['num']) {
      this.num = this.data.num;
    }
    this.formGroupService.setCurIndex([]);
    this.formGroupService.index.subscribe((next) => {
      this.selIndex = next;
      if (this.selIndex.length > 0) {
        if (this.num && this.num > this.keys.length) {
          this.keys.push({ key: this.formGroupService.getQuestionGroupByIndex(this.selIndex).value.key, index: next });
        }

        var unique = {};
        var distinct = [];

        for (var i in this.keys) {
          if (typeof unique[this.keys[i].key] == 'undefined') {
            distinct.push(this.keys[i]);
          }
          unique[this.keys[i].key] = 0;
        }
        this.keys = distinct;
        this.onSel.emit(this.keys);
      }
    });
  }

  removeKey(key) {
    this.keys = this.keys.filter((obj) => {
      return obj.key !== key;
    });
    this.onSel.emit(this.keys);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
