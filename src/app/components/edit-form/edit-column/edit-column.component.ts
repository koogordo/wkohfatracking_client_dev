import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormGroupService} from "../../../_services/form-group-service.service";
import { MatDialog, MatSnackBar} from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-column',
  templateUrl: './edit-column.component.html',
  styleUrls: ['./edit-column.component.scss']
})
export class EditColumnComponent implements OnInit {
  @Input ('group') columnGroup;
  @Input() index: string;
  constructor(private formGroupService: FormGroupService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  addQuestion(){
    this.formGroupService.addQuestion(this.columnGroup.controls['questions']);
  }

 //Temp add questions
  addTextboxQuestion(){
    this.formGroupService.addTextboxQuestion(this.columnGroup.controls['questions']);
  }
  addNumberQuestion(){
    this.formGroupService.addNumberQuestion(this.columnGroup.controls['questions']);
  }
  addCheckboxesQuestion(){
    this.formGroupService.addCheckboxesQuestion(this.columnGroup.controls['questions']);
  }
  addRadioButtonsQuestion(){
    this.formGroupService.addRadioButtonsQuestion(this.columnGroup.controls['questions']);
  }
  addDropdownQuestion(){
    this.formGroupService.addDropdownQuestion(this.columnGroup.controls['questions']);
  }
  addQuestionGroupQuestion(){
    this.formGroupService.addQuestionGroupQuestion(this.columnGroup.controls['questions']);
  }  
  addFunctionQuestion(){
    this.formGroupService.addFunctionQuestion(this.columnGroup.controls['questions']);
  }
  addTimeQuestion(){
    this.formGroupService.addTimeQuestion(this.columnGroup.controls['questions']);
  } 
  addDateQuestion(){
    this.formGroupService.addDateQuestion(this.columnGroup.controls['questions']);
  }
  addQuestionArrayQuestion(){
    this.formGroupService.addQuestionArrayQuestion(this.columnGroup.controls['questions']);
  }
 //
 
  removeQuestion(questionIndex: number){
    this.formGroupService.removeFAItem(this.columnGroup.controls['questions'],questionIndex);
  }

  confirmDialogue(action, actionName, message, index = null) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {action, actionName, message}});
    dialogRef.afterClosed().subscribe(response => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'addTextbox':
            this.addTextboxQuestion();
          break;
          case 'addNumber':
            this.addNumberQuestion();
          break;
          case 'addCheckboxes':
            this.addCheckboxesQuestion();
          break;
          case 'addRadioButtons':
            this.addRadioButtonsQuestion();
          break;
          case 'addDropdown':
            this.addDropdownQuestion();
          break;
          case 'addGroup':
            this.addQuestionGroupQuestion();
          break;
          case 'addFunction':
            this.addFunctionQuestion();
          break;
          case 'addTime':
            this.addTimeQuestion();
          break;
          case 'addDate':
          this.addDateQuestion();
          break;
          case 'addArray':
            this.addQuestionArrayQuestion();
          break;
          case 'delete':
            this.removeQuestion(index);
          break;
       }
      }
    })
  }
}
