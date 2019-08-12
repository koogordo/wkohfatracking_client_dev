import { ValidatorFn } from '@angular/forms';

export interface Validator {
	validator: ValidatorFn;
	description: string;
}