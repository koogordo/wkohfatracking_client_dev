import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-contact-log',
  templateUrl: './edit-contact-log.component.html',
  styleUrls: ['./edit-contact-log.component.scss']
})
export class EditContactLogComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
