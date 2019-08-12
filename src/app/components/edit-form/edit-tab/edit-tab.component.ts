import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormGroupService} from "../../../_services/form-group-service.service";
import { MatDialog, MatSnackBar} from '@angular/material';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-edit-tab',
  templateUrl: './edit-tab.component.html',
  styleUrls: ['./edit-tab.component.scss']
})
export class EditTabComponent implements OnInit {
  @Input ('group') tabGroup;
  @Input() index: string;
  constructor(
    private formGroupService: FormGroupService,
    public dialog: MatDialog,
    ) { }

  ngOnInit() {
  }

  addSection(){
    this.formGroupService.addSection(this.tabGroup.controls['sections']);
  }
  removeSection(sectionIndex: number){
    this.formGroupService.removeFAItem(this.tabGroup.controls['sections'],sectionIndex);
  }

  confirmDialogue(action, actionName, message, index = null) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {action, actionName, message}});
    dialogRef.afterClosed().subscribe(response => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'add':
            this.addSection();
          break;
          case 'delete':
            this.removeSection(index);
          break;
       }
      }
    })
  }

}
