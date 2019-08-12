import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Note } from '../../_models/note';
import * as moment from 'moment';
import { FormGroupService } from '../../_services/form-group-service.service';
import { DatabaseService } from '../../_services/database.service';

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.scss'],
})
export class ViewNotesComponent implements OnInit {
  questionGroup;
  disabledQG;
  noteFG: FormGroup;
  index;
  constructor(private formGroupService: FormGroupService, private databaseService: DatabaseService, public dialogRef: MatDialogRef<ViewNotesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.questionGroup = this.data.questionGroup;
  }

  ngOnInit() {
    this.noteFG = new FormGroup({
      note: new FormControl('', Validators.required),
    });
    this.disabledQG = this.formGroupService.buildFormGroup(this.questionGroup.getRawValue());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  addNote() {
    var note: Note = new Note({
      text: this.noteFG.value.note,
      commenterID: this.databaseService.activeUser.getValue().getName(),
      date: moment().format(),
    });
    this.questionGroup.controls['notes'].push(this.formGroupService.buildFormGroup(note));
    this.noteFG.reset();
  }
}
