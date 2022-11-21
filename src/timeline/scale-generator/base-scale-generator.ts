import { DatePipe } from "@angular/common";

export class BaseScaleGenerator {
  // TODO: locale
  protected localDatePipe = new DatePipe('en');
}
