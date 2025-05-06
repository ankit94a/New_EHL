import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumList',
  standalone:true,
})
export class EnumListPipe implements PipeTransform {

    constructor( ) {
        }
  transform(value: any, args?: any): any {
   return this.stringEnumToKeyValue(value);
  }
  stringEnumToKeyValue(stringEnum: any) {

    const keyValue = [];
    const keys = Object.keys(stringEnum);

    //keys.sort();
    for (const k of keys) {
      keyValue.push({ key: k, value: stringEnum[k] });
    }
    return keyValue;
  }
}


