import {Validator} from "../validator";
import {Validators} from "@angular/forms";
import {Note} from "../note";

export class Input<T>{
  key: string; //unique and consistent (referenced data is the same) between revisions
  input: T;
  label: string;
  labelPosition: ["top","bottom","left","right"];
  labelWidth:number;
  type: string;
  description: string;
  default: T;
  required: boolean;
  validators: Validator[];
  notes: Note[];
  usePreviousValue: boolean;

  constructor(options: {
    key?: string,
    label?: string,
    type?: string,
    description?: string,
    required?: boolean,
    notes?: Note[],
    usePreviousValue ?: boolean
  } = {}) {
    this.key = options.key || '';
    this.label = options.label || '';
    this.labelPosition = options['labelPosition'] || "top";
    this.labelWidth = options['labelWidth'] || "";
    this.type = options.type || '';
    this.description = options.description || '';
    this.required = !!options.required;
    this.notes = options.notes || [];
    this.validators = [];
    this.usePreviousValue = options['usePreviousValue'] || false;
    if (this.required){
      var val: Validator = {
        validator: Validators.required,
        description: "Required"
      };
      this.validators.push(val);
    }
  }
}
