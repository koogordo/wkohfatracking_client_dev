import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/_services/database.service';
import { FormGroupService } from 'src/app/_services/form-group-service.service';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-review-group-management',
  templateUrl: './review-group-management.component.html',
  styleUrls: ['./review-group-management.component.scss'],
})
export class ReviewGroupManagementComponent implements OnInit {
  formGroupToView;
  formID;
  constructor(private _db: DatabaseService, private _fg: FormGroupService, private _dialog: MatDialog, private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    this._fg.formGroup.subscribe((formGroup) => {
      this.formGroupToView = formGroup;
    });
    this._route.params.subscribe((params) => {
      if (params['id'] === 'addNew') {
        this._db.getForm('54blankForm%004Add%20Review%20Group%00%00').then((form) => {
          // console.log(form);
          this.formID = form._id;
          this._fg.newFormGroup(form.form, false);
        });
      } else {
        this._db.getReviewGroup(params['id']).then((doc) => {
          // console.log(doc);
          this.formID = doc._id;
          // console.log(doc.form);
          this._fg.newFormGroup(doc.form, false);
        });
      }
    });
  }

  confirmDialogue(action, actionName, message, dismassMsg, successMsg) {
    let dialogRef = this._dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'addupdate':
            this.addUpdateReviewGroup();
            break;
        }
      }
    });
  }

  addUpdateReviewGroup() {
    const form = this._fg.formGroupBS.getValue().getRawValue();
    this._db.addUpdateReviewGroup(form).then((result) => {
      // console.log(result);
      this._db.activeUser.next(this._db.activeUser.getValue());
      this._router.navigate(['/home']);
    });
  }
}
