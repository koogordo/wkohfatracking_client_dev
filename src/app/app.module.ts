import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { DatabaseService } from './_services/database.service';
import { FormGroupService } from './_services/form-group-service.service';
import { GetInputTypesService } from './_services/get-input-types.service';
import { PreviewFormComponent } from './components/preview-form/preview-form.component';
import { ViewNotesComponent } from './components/view-notes/view-notes.component';
import { SubmittedDialogComponent } from './components/submitted-dialog/submitted-dialog.component';
import { AdminViewFormComponent } from './admin-view-form/admin-view-form.component';
import { UserIdleModule } from 'angular-user-idle';
import { CreateFormComponent, CreateTabComponent, CreateSectionComponent, CreateRowComponent } from './components/create-form';

import { ViewColumnComponent, ViewFormComponent, ViewRowComponent, ViewSectionComponent, ViewTabComponent } from './components/view-form';

import { EditColumnComponent, EditFormComponent, EditRowComponent, EditSectionComponent, EditTabComponent } from './components/edit-form';

import { ViewInputTypeComponent } from './components/input-types/view-input-type';
import { EditInputTypeComponent } from './components/input-types/edit-input-type';
import { EditDropdownComponent, ViewDropdownComponent } from './components/input-types/dropdown';
import { EditNumberComponent, ViewNumberComponent } from './components/input-types/number';
import { EditSsnComponent, ViewSsnComponent } from './components/input-types/ssn';
import { EditTelComponent, ViewTelComponent } from './components/input-types/tel';
import { EditTextareaComponent, ViewTextareaComponent } from './components/input-types/textarea';
import { EditTextboxComponent, ViewTextboxComponent } from './components/input-types/textbox';

import { EditCheckboxComponent, ViewCheckboxComponent } from './components/input-types/checkbox';
import { EditSlideToggleComponent, ViewSlideToggleComponent } from './components/input-types/slide-toggle';
import { EditCheckboxesComponent, ViewCheckboxesComponent } from './components/input-types/checkboxes';
import { EditRadioButtonsComponent, ViewRadioButtonsComponent } from './components/input-types/radio-buttons';
import { EditDateComponent, ViewDateComponent } from './components/input-types/date';
import { EditQuestionArrayComponent, ViewQuestionArrayComponent } from './components/input-types/question-array';
import { EditTimeComponent, ViewTimeComponent } from './components/input-types/time';
import { EditQuestionGroupComponent, ViewQuestionGroupComponent } from './components/input-types/question-group';

import { EditInputMapComponent } from './components/input-types/input-map/edit-input-map.component';
import { ViewInputMapComponent } from './components/input-types/input-map/view-input-map.component';
import { EditSliderComponent } from './components/input-types/slider/edit-slider.component';
import { ViewSliderComponent } from './components/input-types/slider/view-slider.component';
import { AdminComponent } from './admin/admin.component';
import { LookupComponent } from './lookup/lookup.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard, AdminGuard } from './_guards';

import { CookieService } from 'ngx-cookie-service';
import { EditStatesComponent } from './components/input-types/states/edit-states.component';
import { ViewStatesComponent } from './components/input-types/states/view-states.component';
import { EditContactLogComponent } from './components/input-types/contact-log/edit-contact-log.component';
import { ViewContactLogComponent } from './components/input-types/contact-log/view-contact-log.component';
import { AddChildComponent } from './add-child/add-child.component';
import { AddParentComponent } from './add-parent/add-parent.component';
import { ContactLogComponent } from './contact-log/contact-log.component';
import { OsViewFormComponent } from './os-view-form/os-view-form.component';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { ReviewerViewFormComponent } from './reviewer-view-form/reviewer-view-form.component';
import * as PouchDB from 'pouchdb';
import { EditTestComponent } from './components/input-types/test/edit-test.component';
import { ReportingComponent } from './admin/reporting/reporting.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { FamilyManagementComponent } from './admin/family-management/family-management.component';
import { ConnectionService } from './_services/connection.service';
import { QueryBuilderComponent } from './admin/reporting/query-builder/query-builder.component';
import { ReportBuilderComponent } from './admin/reporting/report-builder/report-builder.component';
import { MatExpansionModule } from '@angular/material';
import { NamePipe } from './_pipes/name.pipe';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FamilyArchiveViewComponent } from './components/family-archive-view/family-archive-view.component';
import { FormPdfComponent } from './components/form-pdf/form-pdf.component';
import { ReviewGroupManagementComponent } from './admin/review-group-management/review-group-management.component';
import { EditChildComponent } from './edit-child/edit-child.component';
import { EditParentComponent } from './edit-parent/edit-parent.component';
import { IdleDialogComponent } from './components/idle-dialog/idle-dialog.component';
import { DateGaurdDialogComponent } from './components/date-gaurd-dialog/date-gaurd-dialog.component';
import { StageVisitComponent } from './stage-visit/stage-visit.component';
import { SignatureFieldComponent } from './components/input-types/signature-field/signature-field.component';

import { SignaturePadModule } from 'angular2-signaturepad';

library.add(fas, far);

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    EditFormComponent,
    EditTabComponent,
    EditSectionComponent,
    EditRowComponent,
    EditColumnComponent,
    EditTextboxComponent,
    EditTextareaComponent,
    EditTelComponent,
    CreateFormComponent,
    CreateTabComponent,
    CreateSectionComponent,
    CreateRowComponent,
    PreviewFormComponent,
    ViewNotesComponent,
    ViewFormComponent,
    ViewTabComponent,
    ViewSectionComponent,
    ViewRowComponent,
    ViewColumnComponent,
    ViewTextboxComponent,
    ViewTextareaComponent,
    ViewTelComponent,
    ViewQuestionGroupComponent,
    EditQuestionGroupComponent,
    SubmittedDialogComponent,
    ViewInputTypeComponent,
    EditInputTypeComponent,
    EditSsnComponent,
    ViewSsnComponent,
    ViewNumberComponent,
    EditNumberComponent,
    EditDropdownComponent,
    ViewDropdownComponent,
    EditCheckboxComponent,
    ViewCheckboxComponent,
    EditSlideToggleComponent,
    ViewSlideToggleComponent,
    EditCheckboxesComponent,
    ViewCheckboxesComponent,
    EditRadioButtonsComponent,
    ViewRadioButtonsComponent,
    EditDateComponent,
    ViewDateComponent,
    EditQuestionArrayComponent,
    ViewQuestionArrayComponent,
    EditTimeComponent,
    ViewTimeComponent,
    EditInputMapComponent,
    ViewInputMapComponent,
    EditSliderComponent,
    ViewSliderComponent,
    AdminComponent,
    LookupComponent,
    LoginComponent,
    EditStatesComponent,
    ViewStatesComponent,
    EditContactLogComponent,
    ViewContactLogComponent,
    AddChildComponent,
    AddParentComponent,
    ContactLogComponent,
    OsViewFormComponent,
    ReviewerViewFormComponent,
    EditTestComponent,
    ReportingComponent,
    UserManagementComponent,
    FamilyManagementComponent,
    QueryBuilderComponent,
    ReportBuilderComponent,
    NamePipe,
    AdminViewFormComponent,
    ConfirmDialogComponent,
    FamilyArchiveViewComponent,
    FormPdfComponent,
    ReviewGroupManagementComponent,
    EditChildComponent,
    EditParentComponent,
    IdleDialogComponent,
    DateGaurdDialogComponent,
    StageVisitComponent,
    SignatureFieldComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularFontAwesomeModule,
    AppRoutingModule,
    TextMaskModule,
    CurrencyMaskModule,
    FontAwesomeModule,
    MatExpansionModule,
    UserIdleModule.forRoot({ idle: 3600, timeout: 10, ping: 120 }),
    SignaturePadModule,
  ],
  providers: [AuthGuard, AdminGuard, DatabaseService, FormGroupService, GetInputTypesService, CookieService, ConnectionService, NamePipe],
  entryComponents: [PreviewFormComponent, ViewNotesComponent, SubmittedDialogComponent, ConfirmDialogComponent, DateGaurdDialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
