import { ValidatorFn } from "@angular/forms";

export interface Form {
  key: string;
  rev: string;
  name: string;
  description: string;
  date: number; //Unix timestamp
  client: string; //client key
  os: string; //os key
  reviewer: string; //reviewer key
  tabs: Tab[];
}

export interface Tab {
  name: string;
  description: string;
  sections: Section[]
}

export interface Section {
  name: string;
  description: string;
  rows: Row[];
}

export interface Row {
  columnGap: number; //percentage of row (columnGap*(numColumns-1) + (sum of all column sizes) must not be greater than 100
  columns: Column[];
}

export interface Column {
  width: number; //percentage of row (columnGap*(numColumns-1) + (sum of all column sizes) must not be greater than 100
  questions: Question<any>[];
}

export interface Question<T> {
  key: string; //unique and consistent (referenced data is the same) between revisions
  value: T;
  name: string;
  type: string;
  description: string;
  default: T;
  required: boolean;
  validators: Validator[];
  notes: Note[];
}


export interface Validator {
  validator: ValidatorFn;
  description: string;
}


//notes to and from os and reviewer
export interface Note {
  text: string;
  os: string; //os key
  date: number; //Unix timestamp
}
