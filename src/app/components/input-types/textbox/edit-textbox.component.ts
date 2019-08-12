import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-textbox',
  templateUrl: './edit-textbox.component.html',
  styleUrls: ['./edit-textbox.component.scss']
})
export class EditTextboxComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
