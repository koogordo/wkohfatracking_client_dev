import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-submitted-dialog',
  templateUrl: './submitted-dialog.component.html',
  styleUrls: ['./submitted-dialog.component.scss']
})
export class SubmittedDialogComponent implements OnInit {
  submitted;
  constructor(
    public dialogRef: MatDialogRef<SubmittedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.submitted = this.data.submitted;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}
}
