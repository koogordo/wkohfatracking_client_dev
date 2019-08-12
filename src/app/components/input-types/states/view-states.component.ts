import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ViewQuestion } from '../view-question';
import { FormGroupService } from '../../../_services/form-group-service.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteTrigger, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/app/_services/database.service';
@Component({
  selector: 'view-states',
  templateUrl: './view-states.component.html',
  styleUrls: ['./view-states.component.scss'],
})
export class ViewStatesComponent extends ViewQuestion implements AfterViewInit {
  @ViewChild(MatAutocompleteTrigger)
  trigger: MatAutocompleteTrigger;
  options = [
    'Missouri',
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];
  filteredOptions: Observable<string[]>;

  constructor(public formGroupService: FormGroupService, public db: DatabaseService, public matDialog: MatDialog) {
    super(formGroupService, db, matDialog);
  }

  ngOnInit() {
    super.ngOnInit();

    this.filteredOptions = this.questionGroup.controls.input.valueChanges.pipe(
      startWith(''),
      map((val) => this.filter(val.toString()))
    );
  }

  ngAfterViewInit() {
    this.trigger.panelClosingActions.subscribe(() => {
      if (!!this.trigger.activeOption) {
        this.questionGroup.controls.input.setValue(this.trigger.activeOption.value);
      } else {
        this.questionGroup.controls.input.setValue('');
      }
    });
  }

  filter(val: string): string[] {
    const filterVal = val.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterVal));
  }
}
