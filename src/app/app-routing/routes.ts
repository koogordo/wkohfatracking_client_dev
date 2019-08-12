import { Routes } from '@angular/router';

import { EditFormComponent } from '../components/edit-form/edit-form.component';
import { ViewFormComponent } from '../components/view-form/view-form.component';
import { HomeComponent } from '../home/home.component';
import { CreateFormComponent } from '../components/create-form/create-form.component';
import { AdminComponent } from '../admin/admin.component';
import { LookupComponent } from '../lookup/lookup.component';
import { LoginComponent } from '../login/login.component';
import { AuthGuard, AdminGuard } from '../_guards';
import { AddChildComponent } from '../add-child/add-child.component';
import { AddParentComponent } from '../add-parent/add-parent.component';
import { ContactLogComponent } from '../contact-log/contact-log.component';
import { OsViewFormComponent } from '../os-view-form/os-view-form.component';
import { ReviewerViewFormComponent } from '../reviewer-view-form/reviewer-view-form.component';
import { ReportingComponent } from '../admin/reporting/reporting.component';
import { UserManagementComponent } from '../admin/user-management/user-management.component';
import { FamilyManagementComponent } from '../admin/family-management/family-management.component';
import { AdminViewFormComponent } from '../admin-view-form/admin-view-form.component';
import { FamilyArchiveViewComponent } from '../components/family-archive-view/family-archive-view.component';
import { FormPdfComponent } from '../components/form-pdf/form-pdf.component';
import { ReviewGroupManagementComponent } from '../admin/review-group-management/review-group-management.component';
import { EditChildComponent } from '../edit-child/edit-child.component';
import { EditParentComponent } from '../edit-parent/edit-parent.component';
import { StageVisitComponent } from '../stage-visit/stage-visit.component';
import { SignatureFieldComponent } from '../components/input-types/signature-field/signature-field.component';
export const routes: Routes = [
  {
    path: 'createForm',
    component: CreateFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'viewForm/:id',
    component: OsViewFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'revViewForm/:id',
    component: ReviewerViewFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adminViewForm/:id',
    component: AdminViewFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'familyArchiveView/:id',
    component: FamilyArchiveViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editForm/:id',
    component: EditFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
  {
    path: 'addChild/:id',
    component: AddChildComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editChild/:id',
    component: EditChildComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'addParent/:id',
    component: AddParentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editParent/:id',
    component: EditParentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contactLog/:id',
    component: ContactLogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reporting',
    component: ReportingComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'formPdfView/:id',
    component: FormPdfComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'manageReviewGroups/:id',
    component: ReviewGroupManagementComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'manageUser/:id',
    component: UserManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'stageVisit',
    component: StageVisitComponent,
    canActivate: [AuthGuard],
  },
  { path: 'sigField', component: SignatureFieldComponent },
  { path: 'login', component: LoginComponent },
  { path: '*', redirectTo: '' },
];
