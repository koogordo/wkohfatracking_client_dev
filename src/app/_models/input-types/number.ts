import { Input } from './input';
import {Validators} from '@angular/forms';
import {Validator} from '../validator';


export class NumberInput extends Input<number> {
  type = 'number';
  placeholder: string;
  hint: string;
  maxValue: string;
  minValue: string;
  constructor(options: {} = {}) {
    super(options);
    this.input = options['input'] || options['default'] || '';
    this.default = options['default'] || '';
    this.placeholder = options['placeholder'] || '';
    this.hint = options['hint'] || '';
    this.maxValue = options['maxValue'] || '';
    this.minValue = options['minValue'] || '';
    if (this.minValue !== ''){
      var val: Validator = {
        validator: Validators.min(Number(this.minValue)),
        description: "Minimum: " + this.minValue
      };
      this.validators.push(val);
    }
    if (this.maxValue !== ''){
      var val: Validator = {
        validator: Validators.max(Number(this.maxValue)),
        description:  "Maximum: " + this.maxValue
    };
      this.validators.push(val);
    }

  }
}
