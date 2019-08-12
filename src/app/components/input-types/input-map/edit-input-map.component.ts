import { Component, OnInit } from '@angular/core';
import { EditQuestion } from '../edit-question';
import { PreviewFormComponent } from '../../preview-form/preview-form.component';
import { MatDialog } from '@angular/material';
import { FormGroupService } from '../../../_services/form-group-service.service';

@Component({
  selector: 'edit-input-map',
  templateUrl: './edit-input-map.component.html',
  styleUrls: ['./edit-input-map.component.scss']
})
export class EditInputMapComponent extends EditQuestion {
  formGroup;
  indices;
  constructor(
    public dialog: MatDialog,
    private formGroupService: FormGroupService
  ) {
    super();
    this.formGroupService.formGroupBS.subscribe(formGroup => {
      this.formGroup = formGroup;
    });
  }

  ngOnInit() {
    this.indices = this.questionGroup.value.indices;
    this.questionGroup.controls.function.valueChanges.subscribe(val => {
      if (val === 'income') {
        this.questionGroup.setControl(
          'indices',
          this.formGroupService.buildFormGroup({
            weekly: '',
            monthly: '',
            yearly: ''
          })
        );
      } else {
        this.questionGroup.setControl(
          'indices',
          this.formGroupService.buildFormGroup({})
        );
      }
    });
  }

  selectFromForm(num: number, indices) {
    return this.dialog.open(PreviewFormComponent, {
      width: '90%',
      position: {
        top: '10%',
        left: '10%'
      },
      data: {
        formGroup: Object.assign({}, this.formGroup.value),
        num: num,
        keys: indices
      }
    });
  }

  getIndices(num: number, indices) {
    var sel = this.selectFromForm(num, indices);
    var temp = null;
    const sub = sel.componentInstance.onSel.subscribe(next => {
      indices = next;
    });

    sel.afterClosed().subscribe(next => {
      sub.unsubscribe();
      if (indices) {
        temp = indices.slice(0);
      }
    });
    return new Promise((resolve, reject) => {
      (function wait() {
        if (temp) {
          return resolve(temp);
        }
        setTimeout(wait, 30);
      })();
    });
  }

  addIndices(property: string, num: number) {
    this.getIndices(num, this.indices[property]).then(indices => {
      this.indices[property] = indices;
      this.questionGroup.setControl(
        'indices',
        this.formGroupService.buildFormGroup(this.indices)
      );
   
    });
  }
}
