import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-row',
  templateUrl: './view-row.component.html',
  styleUrls: ['./view-row.component.scss'],
})
export class ViewRowComponent implements OnInit {
  @Input('group') rowGroup;
  @Input() disabled;
  @Input() disabledNotes;
  @Input() cleared;
  @Input() moveup;
  @Input() index;
  @Input() previewMode;
  @Input() formGroupCtx;
  @Input() client;
  columnControlPairs;
  constructor() {}

  ngOnInit() {}

  getColPercent(width): string {
    if (width === 'nogrow') {
      return 'nogrow';
    } else {
      if (width < 0) {
        return '';
      } else return width + '';
    }
  }
  add(a, b) {
    return parseInt(a) + parseInt(b);
  }

  getIndex(i) {
    var temp = JSON.parse(JSON.stringify(this.index));
    temp.push({ type: 'column', index: i });
    return temp;
  }
}
