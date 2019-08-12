import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-time',
  templateUrl: './edit-time.component.html',
  styleUrls: ['./edit-time.component.scss']
})
export class EditTimeComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
