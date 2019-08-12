import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-create-row',
  templateUrl: './create-row.component.html',
  styleUrls: ['./create-row.component.scss']
})
export class CreateRowComponent implements OnInit {
  @Input('group') rowGroup;
  @Input() indices: {
    tabIndex: number;
    sectionIndex: number;
    rowIndex: number;
    columnIndex: number;
    questionIndex: number;
  } = {tabIndex: null, sectionIndex: null, rowIndex: null, columnIndex: null, questionIndex: null};

  constructor() { }

  ngOnInit() {
  }

}
