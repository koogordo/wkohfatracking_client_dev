import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-tel',
  templateUrl: './edit-tel.component.html',
  styleUrls: ['./edit-tel.component.scss']
})
export class EditTelComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
