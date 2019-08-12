import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-textarea',
  templateUrl: './edit-textarea.component.html',
  styleUrls: ['./edit-textarea.component.scss']
})
export class EditTextareaComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
