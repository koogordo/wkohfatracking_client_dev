import {Component, Input, OnInit} from '@angular/core';
import {FormGroupService} from "../../../_services/form-group-service.service";
import { MatDialog, MatSnackBar} from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.scss']
})
export class EditSectionComponent implements OnInit {
  @Input ('group') sectionGroup;
  @Input() index: string;
  panelOpenState;
  panelsStatus = [];
  accOpen = false;
  section;
  constructor(private formGroupService: FormGroupService,
    public dialog: MatDialog
    ) {
  }

  ngOnInit() {
    this.section = this.sectionGroup.value;
    for (let i in this.section.rows){
      this.panelsStatus[i] = false;
    }
  }



  addRow(){
    this.formGroupService.addRow(this.sectionGroup.controls['rows']);
  }

  removeRow(rowIndex: number){
    this.formGroupService.removeFAItem(this.sectionGroup.controls['rows'],rowIndex);
  }

  openPanel(i){
    this.panelsStatus[i] = true;
    this.accOpen = true;
  }
  closePanel(i){
    this.panelsStatus[i] = false;
    this.accOpen = this.checkOpen();
  }
  checkOpen(){
    for(let panel of this.panelsStatus){
      if (panel){
        return true;
      }
    }
    return false;
  }

  guidGenerator() {
    var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }

  confirmDialogue(action, actionName, message, index = null) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {action, actionName, message}});
    dialogRef.afterClosed().subscribe(response => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'add':
            this.addRow();
          break;
          case 'delete':
            this.removeRow(index);
          break;
       }
      }
    })
  }
}
