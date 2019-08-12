import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-ssn',
  templateUrl: './edit-ssn.component.html',
  styleUrls: ['./edit-ssn.component.scss']
})
export class EditSsnComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
