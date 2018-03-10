import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'iterable'
})

export class Iterable implements PipeTransform {
  transform(map: { [key: string]: any }, ...parameters: any[]) {
    return map
    	? Object.keys(map).map((key) => ({ 'key': key, 'value': map[key] }))
    	: undefined;
  }
}