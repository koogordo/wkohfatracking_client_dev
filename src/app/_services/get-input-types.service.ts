import { Injectable } from '@angular/core';

@Injectable()
export class GetInputTypesService {

  constructor() {}

  getInputTypes(){
    //DON'T MODIFY BELOW THIS POINT
    return [
{'key':'textbox','label':'Single Line Textbox'},
{'key':'textarea','label':'Multiple Line Textarea'},
{'key':'tel','label':'US Telephone Number'},
{'key':'ssn','label':'Social Security Number'},
{'key':'number','label':'Number'},
{'key':'dropdown','label':'Dropdown List'},
{'key':'checkbox','label':'Checkbox'},
{'key':'slide-toggle','label':'Slide Toggle'},
{'key':'checkboxes','label':'Group of Checkboxes'},
{'key':'radio-buttons','label':'Group of Radio Buttons'},
{'key':'date','label':'Date'},
{'key':'question-array','label':'Question Array'},
{'key':'question-group','label':'Question Group'},
{'key':'time','label':'Time'},
{'key':'input-map','label':'Input Mapping'},
{'key':'slider','label':'Slider'},
{'key':'states','label':'States'},
{'key':'contact-log','label':'Contact Log'},
]}}
