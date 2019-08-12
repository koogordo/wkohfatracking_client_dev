import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-number',
  templateUrl: './edit-number.component.html',
  styleUrls: ['./edit-number.component.scss']
})
export class EditNumberComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {
    this.questionGroup.controls.minValue.valueChanges.subscribe(minValue => {
      if (minValue) {
        this.questionGroup.controls.minValue.setValue('' + minValue, {
          emitEvent: false
        });
      } else {
        this.questionGroup.controls.minValue.setValue('', { emitEvent: false });
      }
    });
    this.questionGroup.controls.maxValue.valueChanges.subscribe(maxValue => {
      if (maxValue) {
        this.questionGroup.controls.maxValue.setValue('' + maxValue, {
          emitEvent: false
        });
      } else {
        this.questionGroup.controls.maxValue.setValue('', { emitEvent: false });
      }
    });
  }
}
