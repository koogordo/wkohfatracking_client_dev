import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-states',
  templateUrl: './edit-states.component.html',
  styleUrls: ['./edit-states.component.scss']
})
export class EditStatesComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
