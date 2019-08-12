import { Component, OnInit, ViewChild } from '@angular/core';
import { Form } from './_models/form';
import { DatabaseService } from './_services/database.service';
import { FormGroupService } from './_services/form-group-service.service';
import { NavComponent } from './nav/nav.component';
import { UserIdleService } from 'angular-user-idle';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild(NavComponent)
  private nav: NavComponent;
  title = 'app';
  storedForms: Form[];
  constructor(private formService: DatabaseService, private fgbuild: FormGroupService, private _userIdle: UserIdleService) {}
  ngOnInit() {
    //this.formService.getForms().subscribe(forms => this.storedForms = forms);
  }

  test() {
    // this.formService.getForms()
    //   .then(message => console.log(message));

    this.storedForms = [new Form()];
    // console.log(this.fgbuild.buildFormGroup(this.storedForms[0]).controls.tabs);
    //this.storedForms = [this.fgbuild.buildFormGroup(this.storedForms[0]).value];
  }
  changeNavbarParams(returnUrlParams: any) {}
}
