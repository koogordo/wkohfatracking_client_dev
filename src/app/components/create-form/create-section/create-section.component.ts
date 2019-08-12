import {Component, Input, OnInit} from '@angular/core';
import {FormGroupService} from "../../../_services/form-group-service.service";

@Component({
  selector: 'app-create-section',
  templateUrl: './create-section.component.html',
  styleUrls: ['./create-section.component.scss']
})
export class CreateSectionComponent implements OnInit {
  @Input('group') sectionGroup;
  @Input() indices: {
    tabIndex: number;
    sectionIndex: number;
    rowIndex: number;
    columnIndex: number;
    questionIndex: number;
  } = {tabIndex: null, sectionIndex: null, rowIndex: null, columnIndex: null, questionIndex: null};

  constructor(private formGroupService: FormGroupService) { }

  ngOnInit() {
  }

  openRow(rowIndex: number){
    this.indices.rowIndex = rowIndex;
  }

  addRow(){
    this.formGroupService.addRow(this.sectionGroup.controls['rows']);
    this.indices.rowIndex = this.sectionGroup.value.rows.length - 1;
  }

  removeRow(rowIndex:number){
    this.formGroupService.removeFAItem(this.sectionGroup.controls['rows'],rowIndex);

  }

}
