import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'sdhFilter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any, value: string, field: string): any {
    if (items.length === 0 || !value) {
      return items;
    }

    return items.filter((i) => {
      const t = Object.assign({}, i);// делаем глубокую копию объекта i

      if (!isNaN(t[field])) { // проверяем является ли i[field] числом делаем это для того чтобы преобразовать число в строку т к применяем метод indexOf()
        t[field] += '';
      }

      if (field === 'type') {
        t[field] = t[field] === 'income' ? 'доход' : 'расход';
      }

      if (field === 'category') {
        t[field] = t['catName'];
      }
      return t[field].toLowerCase().indexOf(value.toLowerCase()) !== -1;
    })
  }

}
