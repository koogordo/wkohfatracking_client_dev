import {Component, Input, OnInit} from '@angular/core';
import {FormGroupService} from "../../../_services/form-group-service.service";
import { MatDialog, MatSnackBar} from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-row',
  templateUrl: './edit-row.component.html',
  styleUrls: ['./edit-row.component.scss']
})
export class EditRowComponent implements OnInit {
  @Input ('group') rowGroup;
  @Input() index: string;
  selectedIndex: number = 0;
  @Input() main: boolean = true;
  constructor(private formGroupService: FormGroupService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {

  }


  addColumn(){
    this.formGroupService.addColumn(this.rowGroup.controls['columns']);
    this.selectedIndex = this.rowGroup.controls.columns['controls'].length - 1;
    this.setSelectedIndex(this.rowGroup.value.columns.length - 1)
  }

  removeColumn(columnIndex: number){
    this.formGroupService.removeFAItem(this.rowGroup.controls['columns'],columnIndex);
    if(this.selectedIndex == this.rowGroup.value.columns.length){
      this.setSelectedIndex(this.selectedIndex - 1);
    }
  }

  setSelectedIndex(i: number){
    this.selectedIndex = i;
  }
  
  confirmDialogue(action, actionName, message, index = null) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {action, actionName, message}});
    dialogRef.afterClosed().subscribe(response => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'add':
            this.addColumn();
          break;
          case 'delete':
            this.removeColumn(index);
          break;
       }
      }
    })
  }
}
