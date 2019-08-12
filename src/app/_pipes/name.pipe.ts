import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const lowercaseVal = value.toLowerCase();
    const splitVal = lowercaseVal.split('');
    const firsLetter = splitVal[0].toUpperCase()
    splitVal.splice(0, 1, firsLetter);
    return splitVal.join('');
  }

}
