///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import { Component, Input, OnInit } from '@angular/core';
import { Form } from '../../_models/form';
import { DatabaseService } from '../../_services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroupService } from '../../_services/form-group-service.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { PreviewFormComponent } from '../preview-form/preview-form.component';
import { SubmittedDialogComponent } from '../submitted-dialog/submitted-dialog.component';
import { NestedTreeControl } from '@angular/cdk/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.scss'],
})
export class EditFormComponent implements OnInit {
  @Input()
  form: Form;
  formGroup;
  selectedIndex: number = 0;
  submitted;
  formID;
  treeControl: FlatTreeControl<FormNode>;
  treeDataSource: DynamicTreeDataSource;
  dataChange: BehaviorSubject<FormNode[]> = new BehaviorSubject<FormNode[]>([]);
  treeLoading: boolean;
  treeData;
  treeDataMap;
  tabNodesWithoutChildren;
  constructor(
    private databaseService: DatabaseService,
    private formGroupService: FormGroupService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.submitted = false;
      this.formID = params['id'];

      // this.databaseService.getForm(this.formID).then(form => {

      this.databaseService.getForm(this.formID).then((form) => {
        // this.treeDataSource.data = this.treeDataFactory(form.form.tabs);
        this.form = form.form;
        this.form.formID = form._id;
        this.formGroupService.newFormGroup(this.form, false);
      });
      this.formGroupService.formGroup.subscribe((formGroup) => {
        this.formGroup = formGroup;
        const tabControls = this.formGroup.controls.tabs.controls;
        this.treeDataMap = this.treeDataFactory(tabControls);
        const database = new DynamicTreeDatabase(this.treeDataMap);
        this.treeControl = new FlatTreeControl<FormNode>(this.getLevel, this.isExpandable);
        this.treeDataSource = new DynamicTreeDataSource(this.treeControl, database);
        this.treeDataSource.data = database.initialData();
      });
      // this.formGroupService.newFormGroup(this.form);
    });
  }
  // tree functions
  getLevel = (node: FormNode) => node.level;

  isExpandable = (node: FormNode) => node.expandable;

  hasChild = (_: number, _nodeData: FormNode) => _nodeData.expandable;
  //
  addTab() {
    this.formGroupService.addTab(this.formGroup.controls['tabs']);
    this.setSelectedIndex(this.formGroup.value.tabs.length - 1);
  }
  removeTab(tabIndex: number) {
    this.formGroupService.removeFAItem(this.formGroup.controls['tabs'], tabIndex);
    if (this.selectedIndex == this.formGroup.value.tabs.length) {
      this.setSelectedIndex(this.selectedIndex - 1);
    }
  }

  save(form: Form) {
    this.databaseService
      .editForm(form, this.formID)
      .then((doc) => {
        this.submitted = doc;
        this.router.navigate(['/admin']);
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  setSelectedIndex(i: number) {
    this.selectedIndex = i;
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(PreviewFormComponent, {
      width: '90%',
      position: {
        top: '10%',
        left: '10%',
      },
      data: { formGroup: Object.assign({}, this.formGroup.value) },
    });
  }

  openSubmitDialog(): void {
    let dialogRef = this.dialog.open(SubmittedDialogComponent, {
      data: { submitted: this.submitted },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.formGroup = null;
    });
  }

  treeDataFactory(tabs) {
    const data = [];
    tabs.map((tab) => {
      data.push({
        id: `${Date.now()}${Math.random()}${tab.value.name}`,
        level: 1,
        expandable: true,
        isLoading: false,
        // name: tab.controls.name,
        displayName: tab.value.name,
        // description: tab.controls.description,
        type: 'tab',
        formGroup: tab,
        // hasChildren: true,
        children: this.makeTreeChildren(tab),
      });
    });
    return data;
  }

  makeTreeChildren(control: any) {
    const data = [];
    if (control.controls.sections !== undefined) {
      let i = 1;
      for (let section of control.controls.sections.controls) {
        data.push({
          id: `${Date.now()}${Math.random()}`,
          level: 1,
          expandable: true,
          isLoading: false,
          displayName: section.controls.name.value || `Section ${i} - Click To Name`,
          type: 'section',
          formGroup: section,
          children: this.makeTreeChildren(section),
        });
        i++;
      }
    } else if (control.controls.rows !== undefined) {
      let i = 1;
      for (let row of control.controls.rows.controls) {
        data.push({
          id: `${Date.now()}${Math.random()}`,
          level: 1,
          expandable: true,
          isLoading: false,
          displayName: `Row ${i}`,
          type: 'row',
          formGroup: row,
          children: this.makeTreeChildren(row),
        });
        i++;
      }
    } else if (control.controls.columns !== undefined) {
      let i = 1;
      for (let column of control.controls.columns.controls) {
        data.push({
          id: `${Date.now()}${Math.random()}`,
          level: 1,
          expandable: true,
          isLoading: false,
          type: 'column',
          displayName: `Column ${i}`,
          formGroup: column,
          children: this.makeTreeChildren(column),
        });
        i++;
      }
    } else if (control.controls.questions !== undefined) {
      for (let question of control.controls.questions.controls) {
        data.push({
          id: `${Date.now()}${Math.random()}`,
          level: 1,
          expandable: true,
          isLoading: false,
          displayName: question.value.key,
          type: 'question',
          formGroup: question,
          children: this.makeTreeChildren(question),
        });
      }
    }
    return data;
  }

  confirmDialogue(action, actionName, message, form = null, index = null) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { action, actionName, message } });
    dialogRef.afterClosed().subscribe((response) => {
      if (response.actionConfirmed) {
        switch (action) {
          case 'add':
            this.addTab();
            break;
          case 'delete':
            this.removeTab(index);
            break;
          case 'save':
            this.save(form);
            break;
        }
      }
    });
  }
}

class FormNode {
  constructor(
    public id: string,
    public level: number = 1,
    public expandable: boolean = false,
    public isLoading: boolean = false,
    public displayName: string,
    public type: string,
    public formGroup: FormGroup
  ) {}
}

class DynamicTreeDataSource {
  dataChange: BehaviorSubject<FormNode[]> = new BehaviorSubject<FormNode[]>([]);
  get data(): FormNode[] {
    return this.dataChange.value;
  }
  set data(value: FormNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }
  constructor(private treeControl: FlatTreeControl<FormNode>, private database: DynamicTreeDatabase) {}
  connect(collectionViewer: CollectionViewer): Observable<FormNode[]> {
    this.treeControl.expansionModel.onChange!.subscribe((change) => {
      if ((change as SelectionChange<FormNode>).added || (change as SelectionChange<FormNode>).removed) {
        this.handleTreeControl(change as SelectionChange<FormNode>);
      }
    });
    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }
  handleTreeControl(change: SelectionChange<FormNode>) {
    if (change.added.length > 0) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed.length > 0) {
      change.removed.reverse().forEach((node) => this.toggleNode(node, false));
    }
  }
  toggleNode(node: FormNode, expand: boolean) {
    const children = this.database.getChildren(node);
    const index = this.data.map((formNode) => formNode.id).indexOf(node.id);
    if (!children || children.length === 0) {
      // If no children, or cannot find the node, no op
      return;
    }
    node.isLoading = true;
    if (expand) {
      const nodes = children.map(
        (childNode) => new FormNode(childNode.id, childNode.level + 1, this.database.isExpandable(childNode), childNode.isLoading, childNode.displayName, childNode.type, childNode.formGroup)
      );
      this.data.splice(index + 1, 0, ...nodes);
    } else {
      this.data.splice(index + 1, children.length);
    }
    // notify the change
    this.dataChange.next(this.data);
    node.isLoading = false;
  }

  getAllDescendants(node, accum) {
    accum.push(node);
    if (!this.database.hasChildren(node)) {
      return accum;
    }
    const children = this.database.getChildren(node);
    accum = accum.concat(children);
    for (let childNode of children) {
      this.getAllDescendants(childNode, accum);
    }
    return accum;
  }
}

class DynamicTreeDatabase {
  dataMap: Map<string, FormNode[]> = new Map<string, FormNode[]>();
  rootLevelNodes;
  constructor(treeData) {
    this.rootLevelNodes = treeData.map(
      (rootNode): FormNode => {
        return new FormNode(rootNode.id, rootNode.level, rootNode.expandable, rootNode.isLoading, rootNode.displayName, rootNode.type, rootNode.formGroup);
      }
    );
    this.makeDataMap(treeData);
  }

  makeDataMap(nodeArray) {
    if (nodeArray.length === 0) {
      return;
    } else {
      nodeArray.map((node) => {
        const temp = [];
        node.children.forEach((element) => {
          temp.push(new FormNode(element.id, element.level, element.expandable, element.isLoading, element.displayName, element.type, element.formGroup));
        });
        this.dataMap.set(node.id, temp);
        this.makeDataMap(node.children);
      });
    }
  }
  initialData(): FormNode[] {
    return this.rootLevelNodes;
  }
  getChildren(node: FormNode): FormNode[] | undefined {
    return this.dataMap.get(node.id);
  }
  isExpandable(node: FormNode): boolean {
    return this.dataMap.has(node.id) && !(node.type === 'column');
  }
  hasChildren(node: FormNode): boolean {
    return this.dataMap.has(node.id);
  }
}
