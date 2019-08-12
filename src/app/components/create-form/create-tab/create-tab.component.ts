import {Component, Input, OnInit} from '@angular/core';
import {FormGroupService} from "../../../_services/form-group-service.service";

@Component({
  selector: 'app-create-tab',
  templateUrl: './create-tab.component.html',
  styleUrls: ['./create-tab.component.scss']
})
export class CreateTabComponent implements OnInit {
  @Input('group') tabGroup;
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

  openSection(sectionIndex: number){
    this.indices.sectionIndex = sectionIndex;
  }

  addSection(){
    this.formGroupService.addSection(this.tabGroup.controls['sections']);
    this.indices.sectionIndex = this.tabGroup.controls.sections.controls.length - 1;
  }

  removeSection(sectionIndex:number){
    this.formGroupService.removeFAItem(this.tabGroup.controls['sections'],sectionIndex);
  }

}
