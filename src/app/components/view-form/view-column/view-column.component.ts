import { Component, Input, OnInit } from '@angular/core';
import { ViewNotesComponent } from '../../view-notes/view-notes.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-view-column',
  templateUrl: './view-column.component.html',
  styleUrls: ['./view-column.component.scss'],
})
export class ViewColumnComponent implements OnInit {
  @Input('group') columnGroup;
  @Input() disabled;
  @Input() disabledNotes;
  @Input() cleared;
  @Input() index;
  @Input() moveup;
  @Input() previewMode;
  @Input() formGroupCtx;
  @Input() client;
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  showNotes(questionGroup) {
    let dialogRef = this.dialog.open(ViewNotesComponent, {
      data: { questionGroup: questionGroup },
    });
  }

  getIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'question', index: i });
    return temp;
  }
}
