import {Pipe, PipeTransform} from "@angular/core";
import * as moment from 'moment'; // кладём содержимое всего модуля в переменную moment

@Pipe({
  name: 'sdhMoment'
})

//formatFrom формат строки value который передаём в moment описываем сами
//formatTo формат строки value которую хотим получить так же описываем сами (т.к указали значение по умолчанию т при его использовании formatTo указывать не обязательно)

export class MomentPipe implements PipeTransform {

  transform(value: string, formatFrom: string, formatTo: string = 'DD.MM.YYYY'): string {
    return moment(value, formatFrom).format(formatTo);
  }

}
