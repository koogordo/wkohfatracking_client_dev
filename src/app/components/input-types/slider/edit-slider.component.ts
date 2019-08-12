import { Component } from '@angular/core';
import { EditQuestion } from '../edit-question';

@Component({
  selector: 'edit-slider',
  templateUrl: './edit-slider.component.html',
  styleUrls: ['./edit-slider.component.scss']
})
export class EditSliderComponent extends EditQuestion {
  constructor() {
    super();
  }

  ngOnInit() {}
}
