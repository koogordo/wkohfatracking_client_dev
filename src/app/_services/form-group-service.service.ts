import * as inputTypes from '../_models/input-types';

import { Injectable, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

import { Subject, BehaviorSubject } from 'rxjs';
import { Form } from '../_models/form';
import { Tab } from '../_models/tab';
import { Section } from '../_models/section';
import { Row } from '../_models/row';
import { Column } from '../_models/column';
import { parse, stringify } from 'flatted';
@Injectable()
export class FormGroupService implements OnInit {
  formGroupSource = new Subject<FormGroup>();
  formGroupBS;
  prevFormGroupBS = new BehaviorSubject<FormGroup>(null);
  formGroup = this.formGroupSource.asObservable();
  private _formGroup: FormGroup;

  reviewQuestionGroupSource = new Subject<FormGroup>();
  questionGroup = this.reviewQuestionGroupSource.asObservable();

  index = new BehaviorSubject<any[]>([]);

  constructor(private _fb: FormBuilder) {
    this.formGroup.subscribe((formGroup) => {
      this._formGroup = formGroup;
      if (!this.formGroupBS) {
        this.formGroupBS = new BehaviorSubject<FormGroup>(this._formGroup);

        //console.log(formGroup.value);
      } else {
        this.formGroupBS.next(this._formGroup);
        //console.log(formGroup.value);
      }
    });
  }

  ngOnInit() {}
  getCurrentFormGroup() {
    return this._formGroup;
  }
  getQuestionGroupByIndex(inputIndex, form = null) {
    const index = JSON.parse(JSON.stringify(inputIndex));
    const itype = index[0].type;
    if (!form) {
      form = this._formGroup;
    }

    if (itype === 'tab') {
      const tabIndex = index.splice(0, 1);
      if (index.length === 0) {
        return form.controls.questions.controls[tabIndex[0].index];
      } else {
        return this.getQuestionGroupByIndex(index, form.controls.tabs.controls[tabIndex[0].index]);
      }
    } else if (itype === 'section') {
      const sectIndex = index.splice(0, 1);
      if (index.length === 0) {
        return form.controls.questions.controls[sectIndex[0].index];
      } else {
        return this.getQuestionGroupByIndex(index, form.controls.sections.controls[sectIndex[0].index]);
      }
    } else if (itype === 'input') {
      const inputIndex = index.splice(0, 1);
      const rowIndex = index.splice(0, 1);
      if (index.length === 0) {
        return form.controls.questions.controls[inputIndex[0].index];
      } else {
        return this.getQuestionGroupByIndex(index, form.controls.input.controls[inputIndex[0].index].controls.rows.controls[rowIndex[0].index]);
      }
    } else if (itype === 'row') {
      const rowIndex = index.splice(0, 1);
      if (index.length === 0) {
        return form.controls.questions.controls[rowIndex[0].index];
      } else {
        return this.getQuestionGroupByIndex(index, form.controls.rows.controls[rowIndex[0].index]);
      }
    } else if (itype === 'option') {
      const optIndex = index.splice(0, 1);
      if (index.length === 0) {
        return form.controls.questions.controls[optIndex[0].index];
      } else {
        return this.getQuestionGroupByIndex(index, form.controls.options.controls[optIndex[0].index]);
      }
    } else if (itype === 'column') {
      const colIndex = index.splice(0, 1);
      if (index.length === 0) {
        return form.controls.questions.controls[colIndex[0].index];
      } else {
        return this.getQuestionGroupByIndex(index, form.controls.columns.controls[colIndex[0].index]);
      }
    } else if (itype === 'question') {
      const queIndex = index.splice(0, 1);
      if (index.length === 0) {
        return form.controls.questions.controls[queIndex[0].index];
      } else {
        return this.getQuestionGroupByIndex(index, form.controls.questions.controls[queIndex[0].index]);
      }
    } else {
      return null;
    }
    // console.log(this._formGroup);
    // if (!form) {
    //   form = this._formGroup.controls['tabs']['controls'][index[0].index].controls.sections.controls[index[1].index];
    //   index.splice(0, 2);
    // }
    // if (index[0].type === 'input') {
    //   form = form.controls.input[index[0].index];
    //   index.splice(0, 1);
    // }

    // if (index[0].type === 'option') {
    //   form = form.controls.options.controls[index[0].index];
    //   index.splice(0, 1);
    // }
    // let question = form.controls.rows.controls[index[0].index].controls.columns.controls[index[1].index].controls.questions.controls[index[2].index];
    // index.splice(0, 3);

    // if (index.length != 0) {
    //   question = this.getQuestion(index, question);
    // }
    // return question;
  }

  getQuestionGroupToEdit(form, indexc) {
    const index = JSON.parse(JSON.stringify(indexc));
    let question;
    // !!form['tabs'] checks if it is a regular question because it checks if index starts at tabs
    // !!form['options'] checks if it is a nested question because it checks if index starts at options
    // !!form[<start level of new question depth>] would have to be added if a new question depth is added
    if (!!form['tabs']) {
      question = form['tabs'][index[0].index]['sections'][index[1].index]['rows'][index[2].index]['columns'][index[3].index]['questions'][index[4].index];
      index.splice(0, 5);
    } else if (!!form['options']) {
      question = form['options'][index[0].index]['rows'][index[1].index]['columns'][index[2].index]['questions'][index[3].index];
      index.splice(0, 4);
    } else if (!!form['rows']) {
      question = form['rows'][index[0].index]['columns'][index[1].index]['questions'][index[2].index];
      index.splice(0, 3);
    }
    if (index.length !== 0) {
      question = this.getQuestionGroupToEdit(question, index);
    }
    return question;
  }

  setCurQuestionGroup(questionGroup) {
    this.reviewQuestionGroupSource.next(questionGroup);
  }

  setCurIndex(index) {
    //console.log(index);
    this.index.next(index);
  }

  addTab(tabFormArray: FormArray, tab: Tab = new Tab()) {
    tabFormArray.push(this.buildFormGroup(tab));
  }
  addSection(sectionFormArray: FormArray, section: Section = new Section()) {
    sectionFormArray.push(this.buildFormGroup(section));
  }
  addRow(rowFormArray: FormArray, row: Row = new Row()) {
    rowFormArray.push(this.buildFormGroup(row));
  }
  addColumn(colFormArray: FormArray, column: Column = new Column()) {
    colFormArray.push(this.buildFormGroup(column));
  }

  //Temp set of add-Questions
  addTextboxQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.Textbox()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addNumberQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.NumberInput()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addCheckboxesQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.Checkboxes()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addRadioButtonsQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.RadioButtons()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addDropdownQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.Dropdown()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addQuestionGroupQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.QuestionGroup()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addFunctionQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.InputMap()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addTimeQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.Time()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addDateQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.DateInput()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addQuestionArrayQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.QuestionArray()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  //

  addQuestion(questionFormArray: FormArray, question: inputTypes.Input<any> = new inputTypes.Textbox()) {
    questionFormArray.push(this.buildFormGroup(question));
  }
  addOption(optionFormArray: FormArray, option: { key: string; value: string } = { key: '', value: '' }) {
    optionFormArray.push(this.buildFormGroup(option));
  }
  addSpecifyOption(
    optionFormArray: FormArray,
    option: {
      key: string;
      value: string;
      specify: boolean;
      rows: Row[];
      labelWidth: string;
    } = {
      key: '',
      value: '',
      specify: false,
      rows: [],
      labelWidth: 'nogrow',
    }
  ) {
    optionFormArray.push(this.buildFormGroup(option));
  }
  removeFAItem(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }

  updateQuestionType(questionArray: FormArray, questionIndex) {
    var question = questionArray.value[questionIndex];
    var noDelete = ['label', 'key', 'type', 'description', 'labelPosition', 'labelWidth'];
    for (let prop in question) {
      if (noDelete.indexOf(prop) < 0) {
        delete question[prop];
      }
    }
    questionArray.setControl(questionIndex, this.buildFormGroup(this.getQuestionOfType(question)));
  }

  setControl(parentFormGroup: FormGroup, newValues, name) {
    parentFormGroup.setControl(name, this.buildFormArray(newValues));
  }

  updateFormGroup(fg: FormGroup) {
    this.formGroupSource.next(fg);
    this.setCurIndex([]);
  }
  newFormGroup(form = new Form(), initialLoadFlag) {
    if (!form) {
      form = new Form();
    }
    form = JSON.parse(JSON.stringify(form));
    let fg = this.buildFormGroup(form);
    fg = this.setInitialLoadFlagsOnQuestions(fg, initialLoadFlag);

    this.formGroupSource.next(fg);
    this.formGroupBS.next(fg);
    //console.log(this.buildFormGroup(form).value);
  }

  newPrevFormGroup(form) {
    form = JSON.parse(JSON.stringify(form));
    if (form) {
      const fg = this.buildFormGroup(form);
      this.prevFormGroupBS.next(fg);
    } else {
      this.prevFormGroupBS.next(null);
    }
  }

  buildFormArray(obj) {
    var propArr = [];
    for (let mem in obj) {
      var temp: any = Object.assign({}, obj[mem]);
      temp = this.buildFormGroup(temp);
      propArr.push(temp);
    }
    return this._fb.array(propArr);
  }

  //not really sure how resource expensive it is to maintain a giant FormGroup
  buildFormGroup(obj): FormGroup {
    obj = JSON.parse(JSON.stringify(obj));
    const objCopy: any = obj;

    for (let prop in objCopy) {
      if (prop === 'questions') {
        for (let questIndex in objCopy[prop]) {
          objCopy[prop][questIndex] = this.getQuestionOfType(objCopy[prop][questIndex]);
          //console.log(objCopy[prop][questIndex]['key']);
        }
      }
      if (prop === 'initialLoad') {
        console.log(prop, ':', objCopy[prop]);
      }
      if (prop === 'name') {
        //set unique validator
        //set required validator
      }
      if (prop === 'width') {
        //set column width validator
      }
      if (prop === 'columnGap') {
        //set columnGap width validator
        if (objCopy[prop] === null) {
          objCopy[prop] = 0;
        }
      }
      if (prop === 'columns') {
        for (let col in objCopy['columns']) {
          objCopy[prop][col] = new Column(objCopy[prop][col]);
        }
      }
      if (prop === 'questions') {
        for (let question in obj[prop]) {
          objCopy[prop][question] = this.getQuestionOfType(objCopy[prop][question]);
        }
      }
      if (prop === 'validators' && objCopy['type'] !== 'question-array') {
        objCopy[prop] = this.getQuestionOfType(objCopy)[prop];
        var vals = [];
        for (let val of objCopy[prop]) {
          vals.push(val['validator']);
        }
        objCopy['input'] = [objCopy['input'], Validators.compose(vals)];
      }
      if ((Array.isArray(objCopy[prop]) && prop !== 'input' && prop !== 'validators') || (Array.isArray(objCopy[prop]) && prop === 'input' && objCopy['type'] === 'question-array')) {
        var propArr = [];

        for (let mem in objCopy[prop]) {
          let temp: any = JSON.parse(JSON.stringify(objCopy[prop][mem]));
          if (typeof objCopy[prop][mem] === 'object' || Array.isArray(objCopy[prop][mem])) {
            temp = this.buildFormGroup(temp);
          }
          propArr.push(temp);
        }
        let tempFA = this._fb.array(propArr);
        objCopy[prop] = new FormArray(tempFA.controls, { updateOn: 'blur' });
      } else if (typeof objCopy[prop] === 'object' && prop !== 'input' && prop !== 'validators') {
        objCopy[prop] = this.buildFormGroup(objCopy[prop]);
      }
    }

    let tempFG = this._fb.group(objCopy);
    return new FormGroup(tempFG.controls, { updateOn: 'blur' });
  }

  findFormPartByIndex(fgValue, indexc) {
    const index = JSON.parse(JSON.stringify(indexc));
    const itype = index[0].type;

    if (itype === 'tab') {
      const tabIndex = index.splice(0, 1);
      if (index.length === 0) {
        return fgValue.questions[tabIndex[0].index];
      } else {
        return this.findFormPartByIndex(fgValue.tabs[tabIndex[0].index], index);
      }
    } else if (itype === 'section') {
      const sectIndex = index.splice(0, 1);
      if (index.length === 0) {
        return fgValue.questions[sectIndex[0].index];
      } else {
        return this.findFormPartByIndex(fgValue.sections[sectIndex[0].index], index);
      }
    } else if (itype === 'input') {
      const inputIndex = index.splice(0, 1);
      const rowIndex = index.splice(0, 1);
      if (index.length === 0) {
        return fgValue.questions[inputIndex[0].index];
      } else {
        return this.findFormPartByIndex(fgValue.input[inputIndex[0].index].rows[rowIndex[0].index], index);
      }
    } else if (itype === 'row') {
      const rowIndex = index.splice(0, 1);
      if (index.length === 0) {
        return fgValue.questions[rowIndex[0].index];
      } else {
        return this.findFormPartByIndex(fgValue.rows[rowIndex[0].index], index);
      }
    } else if (itype === 'option') {
      const optIndex = index.splice(0, 1);
      if (index.length === 0) {
        return fgValue.questions[optIndex[0].index];
      } else {
        return this.findFormPartByIndex(fgValue.options[optIndex[0].index], index);
      }
    } else if (itype === 'column') {
      const colIndex = index.splice(0, 1);
      if (index.length === 0) {
        return fgValue.questions[colIndex[0].index];
      } else {
        return this.findFormPartByIndex(fgValue.columns[colIndex[0].index], index);
      }
    } else if (itype === 'question') {
      const queIndex = index.splice(0, 1);
      if (index.length === 0) {
        return fgValue.questions[queIndex[0].index];
      } else {
        return this.findFormPartByIndex(fgValue.questions[queIndex[0].index], index);
      }
    } else {
      return null;
    }
  }

  descendAndReplaceQuestionValue(fgValue, newQuestionGroupVal, indexc) {
    const index = JSON.parse(JSON.stringify(indexc));
    const itype = index[0].type;
    if (itype === 'tab') {
      const tabIndex = index.splice(0, 1);
      return this.descendAndReplaceQuestionValue(fgValue.tabs[tabIndex[0].index], newQuestionGroupVal, index);
    } else if (itype === 'section') {
      const sectIndex = index.splice(0, 1);
      return this.descendAndReplaceQuestionValue(fgValue.sections[sectIndex[0].index], newQuestionGroupVal, index);
    } else if (itype === 'input') {
      const inputIndex = index.splice(0, 1);
      const rowIndex = index.splice(0, 1);
      return this.descendAndReplaceQuestionValue(fgValue.input[inputIndex[0].index].rows[rowIndex[0].index], newQuestionGroupVal, index);
    } else if (itype === 'row') {
      const rowIndex = index.splice(0, 1);
      return this.descendAndReplaceQuestionValue(fgValue.rows[rowIndex[0].index], newQuestionGroupVal, index);
    } else if (itype === 'option') {
      const optIndex = index.splice(0, 1);
      return this.descendAndReplaceQuestionValue(fgValue.options[optIndex[0].index], newQuestionGroupVal, index);
    } else if (itype === 'column') {
      const colIndex = index.splice(0, 1);
      return this.descendAndReplaceQuestionValue(fgValue.columns[colIndex[0].index], newQuestionGroupVal, index);
    } else if (itype === 'question') {
      const queIndex = index.splice(0, 1);
      if (index.length === 0) {
        fgValue.questions[queIndex[0].index] = newQuestionGroupVal;
        return true;
      } else {
        return this.descendAndReplaceQuestionValue(fgValue.questions[queIndex[0].index], newQuestionGroupVal, index);
      }
    } else {
      return false;
    }
  }

  indexQuestionGroup(fgValue, key, indexc: any[] = []) {
    const index = JSON.parse(JSON.stringify(indexc));
    if (fgValue.key === key) {
      return index;
    }

    if (fgValue.tabs) {
      index.push({ type: 'tab' });
      return this.indexFormPartChildren(fgValue.tabs, key, index);
    } else if (fgValue.sections) {
      index.push({ type: 'section' });
      return this.indexFormPartChildren(fgValue.sections, key, index);
    } else if (fgValue.rows && fgValue.type !== 'question-array') {
      index.push({ type: 'row' });
      return this.indexFormPartChildren(fgValue.rows, key, index);
    } else if (fgValue.input && fgValue.type === 'question-array') {
      index.push({ type: 'input' });
      return this.indexFormPartChildren(fgValue.input, key, index);
      // return this.indexFormPartChildren(fgValue.input[0].rows, key, index);
    } else if (fgValue.columns) {
      index.push({ type: 'column' });
      return this.indexFormPartChildren(fgValue.columns, key, index);
    } else if (fgValue.options) {
      index.push({ type: 'option' });
      return this.indexFormPartChildren(fgValue.options, key, index);
    } else if (fgValue.questions) {
      index.push({ type: 'question' });
      return this.indexFormPartChildren(fgValue.questions, key, index);
    } else {
      return null;
    }
  }

  indexFormPartChildren(formPartChildren, key, index) {
    for (const childIndex in formPartChildren) {
      let tempIndex = index;
      tempIndex[tempIndex.length - 1].index = childIndex;
      const temp = this.indexQuestionGroup(formPartChildren[childIndex], key, tempIndex);
      if (temp) {
        return temp;
      }
    }
    return null;
  }

  //DO NOT MODIFY OR PUT ANYTHING BELOW HERE!
  //(unless you are familiar with "gen-input-comp" script)
  getQuestionOfType(question): inputTypes.Input<any> {
    switch (question.type) {
      case 'textbox': {
        return new inputTypes.Textbox(question);
      }
      case 'textarea': {
        return new inputTypes.Textarea(question);
      }
      case 'tel': {
        return new inputTypes.Tel(question);
      }
      case 'ssn': {
        return new inputTypes.Ssn(question);
      }
      case 'number': {
        return new inputTypes.NumberInput(question);
      }
      case 'dropdown': {
        return new inputTypes.Dropdown(question);
      }
      case 'checkbox': {
        return new inputTypes.Checkbox(question);
      }
      case 'slide-toggle': {
        return new inputTypes.SlideToggle(question);
      }
      case 'checkboxes': {
        return new inputTypes.Checkboxes(question);
      }
      case 'radio-buttons': {
        return new inputTypes.RadioButtons(question);
      }
      case 'date': {
        return new inputTypes.DateInput(question);
      }
      case 'question-array': {
        return new inputTypes.QuestionArray(question);
      }
      case 'question-group': {
        return new inputTypes.QuestionGroup(question);
      }
      case 'time': {
        return new inputTypes.Time(question);
      }
      case 'input-map': {
        return new inputTypes.InputMap(question);
      }
      case 'slider': {
        return new inputTypes.Slider(question);
      }
      case 'states': {
        return new inputTypes.States(question);
      }
      case 'contact-log': {
        return new inputTypes.ContactLog(question);
      }
      case 'signature': {
        return new inputTypes.Signature(question);
      }
      default: {
        return new inputTypes.Input(question);
      }
    }
  }

  updateAndStageChanges(questionKey: string, updateValue: any) {
    const index = this.indexQuestionGroup(this._formGroup.getRawValue(), questionKey);
    this.getQuestionGroupByIndex(index).controls.input.setValue(updateValue, { emitEvent: false });

    this.formGroupBS.next(this._formGroup);
  }

  addQuestionArrayInputAndStageChanges(questionKey: string, newInput) {
    const index = this.indexQuestionGroup(this._formGroup.getRawValue(), questionKey);
    let builtNewInput = this.buildFormGroup({ rows: newInput });
    builtNewInput = this.setInitialLoadFlagsOnQuestions(builtNewInput, true);
    this.getQuestionGroupByIndex(index).controls.input.push(builtNewInput);
    this.formGroupBS.next(this._formGroup);
  }

  removeQuestionArrayInputAndStageChanges(questionKey: string, removeIndex) {
    const index = this.indexQuestionGroup(this._formGroup.getRawValue(), questionKey);
    (this.getQuestionGroupByIndex(index).controls.input as FormArray).removeAt(removeIndex);
    this.formGroupBS.next(this._formGroup);
  }

  updateQuestionGroupInputControlsAndStageChanges(questionKey: string, newInputs) {
    const index = this.indexQuestionGroup(this._formGroup.getRawValue(), questionKey);
    this.getQuestionGroupByIndex(index).controls.input = newInputs;
    this.formGroupBS.next(this._formGroup);
  }

  setInitialLoadFlagsOnQuestions(formGroup = null, flag, track = false) {
    if (!formGroup) {
      formGroup = this._formGroup;
    }
    if (formGroup.controls.tabs) {
      for (const tabControl of formGroup.controls.tabs.controls) {
        this.setInitialLoadFlagsOnQuestions(tabControl, flag);
      }
    } else if (formGroup.controls.sections) {
      for (const sectionControl of formGroup.controls.sections.controls) {
        this.setInitialLoadFlagsOnQuestions(sectionControl, flag);
      }
    } else if (formGroup.controls.rows && formGroup.getRawValue().type === 'question-array') {
      // (formGroup as FormGroup).addControl('initialLoad', new FormControl(true));

      for (const inputControl of formGroup.controls.input.controls) {
        for (const rowControl of inputControl.controls.rows.controls) {
          this.setInitialLoadFlagsOnQuestions(rowControl, flag);
        }
      }
    } else if (formGroup.controls.rows && formGroup.getRawValue().type !== 'question-array') {
      for (const rowControl of formGroup.controls.rows.controls) {
        this.setInitialLoadFlagsOnQuestions(rowControl, flag);
      }
    } else if (formGroup.controls.columns) {
      for (const columnControl of formGroup.controls.columns.controls) {
        // console.log(columnControl);
        this.setInitialLoadFlagsOnQuestions(columnControl, flag);
      }
    } else if (formGroup.controls.options) {
      for (const optionControl of formGroup.controls.options.controls) {
        this.setInitialLoadFlagsOnQuestions(optionControl, flag);
      }
    } else if (formGroup.controls.questions) {
      formGroup.controls.questions.controls.forEach((question) => {
        // question.value.initialLoad = flag;
        if (!(question as FormGroup).contains('initialLoad')) {
          // if (question.getRawValue().key === 'Sp-Module') {
          //   console.log(question);
          //   console.log((question as FormGroup).contains('initialLoad'));
          // }
          (question as FormGroup).addControl('initialLoad', new FormControl(flag));
          // if (question.getRawValue().key === 'Sp-Module') {
          //   console.log(question);
          //   console.log((question as FormGroup).contains('initialLoad'));
          // }
        } else {
          // if (question.getRawValue().key === 'Sp-Module') {
          //   console.log(question);
          // }
          question.controls.initialLoad.setValue(flag, { emitEvent: false });
        }

        if (question.controls.options) {
          for (const optionControl of question.controls.options.controls) {
            if (optionControl.controls.rows.controls.length > 0) {
              this.setInitialLoadFlagsOnQuestions(optionControl, flag);
            }
          }
        } else if (question.controls.rows && question.getRawValue().type === 'question-array') {
          for (const inputControl of question.controls.input.controls) {
            for (const rowControl of inputControl.controls.rows.controls) {
              this.setInitialLoadFlagsOnQuestions(rowControl, flag);
            }
          }
        } else if (question.controls.rows && question.getRawValue().type !== 'question-array') {
          for (const rowControl of question.controls.rows.controls) {
            this.setInitialLoadFlagsOnQuestions(rowControl, flag);
          }
        }
      });
    }
    return formGroup;
  }

  getQuestionGroupInputValue(key) {
    const fg = this.formGroupBS.getValue().getRawValue();
    const index = this.indexQuestionGroup(fg, key);
    if (index) {
      return this.findFormPartByIndex(fg, this.indexQuestionGroup(fg, key)).input;
    }
    return '';
  }

  compress(form, compressedForm: any = {}): any {
    if (Object.keys(compressedForm).length === 0) {
      for (const prop in form) {
        if (prop !== 'tabs') {
          compressedForm[prop] = form[prop];
        }
      }
      compressedForm.contents = [];
    }
    if (form.tabs) {
      for (const tabControl of form.tabs) {
        this.compress(tabControl, compressedForm);
      }
    } else if (form.sections) {
      for (const sectionControl of form.sections) {
        this.compress(sectionControl, compressedForm);
      }
    } else if (form.rows && form.type === 'question-array') {
      // (form as form).addControl('initialLoad', new FormControl(true));

      for (const inputControl of form.controls.input.controls) {
        for (const rowControl of inputControl.rows) {
          this.compress(rowControl, compressedForm);
        }
      }
    } else if (form.rows && form.type !== 'question-array') {
      for (const rowControl of form.rows) {
        this.compress(rowControl, compressedForm);
      }
    } else if (form.columns) {
      for (const columnControl of form.columns) {
        // console.log(columnControl);
        this.compress(columnControl, compressedForm);
      }
    } else if (form.options) {
      for (const optionControl of form.options) {
        this.compress(optionControl, compressedForm);
      }
    } else if (form.questions) {
      form.questions.forEach((question) => {
        compressedForm.contents.push({
          key: question.key,
          value: question.input,
          notes: question.notes || [],
        });
        if (question.options) {
          for (const optionControl of question.options) {
            if (optionControl.rows.length > 0) {
              this.compress(optionControl, compressedForm);
            }
          }
        } else if (question.rows && question.type === 'question-array') {
          for (const inputControl of question.input) {
            for (const rowControl of inputControl.rows) {
              this.compress(rowControl, compressedForm);
            }
          }
        } else if (question.rows && question.type !== 'question-array') {
          for (const rowControl of question.rows) {
            this.compress(rowControl, compressedForm);
          }
        }
      });
    }
    return compressedForm;
  }

  expand(form, compressedForm) {
    const formCopy = JSON.parse(JSON.stringify(form));
    for (const prop in formCopy) {
      if (prop !== 'tabs') {
        formCopy[prop] = compressedForm[prop];
      }
    }
    for (const question of compressedForm.contents) {
      const index = this.indexQuestionGroup(formCopy, question.key);
      const formPart = this.findFormPartByIndex(formCopy, index);
      formPart.input = question.value;
      formPart.notes = question.notes;
    }
    return formCopy;
  }

  isCompressed(form) {
    return form.contents ? true : false;
  }
}
