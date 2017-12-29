import {Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {take} from 'rxjs/operators';

const ENTER = 13;
const SPACE = 32;
const PAGE_UP = 33;
const PAGE_DOWN = 34;
const END = 35;
const HOME = 36;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const RIGHT_ARROW = 39;
const LEFT_ARROW = 37;


class DlDateTimePickerChange {
  utc: number;

  constructor(milliseconds: number) {
    this.utc = milliseconds;
  }
}

@Component({
  selector: 'dl-date-time-picker',
  templateUrl: './dl-date-time-picker.component.html',
  styleUrls: ['./dl-date-time-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DlDateTimePickerComponent,
      multi: true
    }
  ]
})
export class DlDateTimePickerComponent implements OnInit, ControlValueAccessor {

  @Input()
  maxView: 'year' | 'month' | 'day' | 'hour' | 'minute';

  @Input()
  startView: 'year' | 'month' | 'day' | 'hour' | 'minute';

  @Input()
  minView: 'year' | 'month' | 'day' | 'hour' | 'minute';

  /** Emits when a `change` event is fired on this date/time picker. */
  @Output()
  change = new EventEmitter<DlDateTimePickerChange>();

  // @Input()
  leftIconClass = {
    'oi': true,
    'oi-chevron-left': true
  };

  upIconClass = {
    'oi': true,
    'oi-chevron-top': true
  };

  // @Input()
  rightIconClass = {
    'oi': true,
    'oi-chevron-right': true
  };

  private _changed: ((value: number) => void)[] = [];
  private _model: DlDateTimePickerModel;
  private _touched: (() => void)[] = [];
  private _value: number;

  constructor(private _elementRef: ElementRef,
              private _ngZone: NgZone) {

  }

  ngOnInit(): void {
    if (this.startView === 'month') {
      this._model = this.monthModel(moment.utc().valueOf());
      return;
    }
    this._model = this.yearModel(moment.utc().valueOf());
  }

  private yearModel(milliseconds: number): DlDateTimePickerModel {
    const rowNumbers = [0, 1];
    const columnNumbers = [0, 1, 2, 3, 4];

    const startYear = moment.utc(milliseconds).startOf('year');

    // View starts one year before the decade starts and ends one year after the decade ends
    // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
    // Truncate the last digit from the current year and subtract 1 to get the start of the decade
    const startDecade = (Math.trunc(startYear.year() / 10) * 10);

    const startDate = moment.utc(`${startDecade}-01-01`).startOf('year');

    // future and past years range is inclusive of start year decade.
    const futureYear = startDate.year() + 9;
    const pastYear = startDate.year();

    const result: DlDateTimePickerModel = {
      view: 'year',
      viewLabel: `${pastYear}-${futureYear}`,
      activeDate: startYear.valueOf(),
      leftButton: {
        value: moment.utc(startDate).subtract(9, 'years').valueOf(),
        ariaLabel: `Go to ${pastYear - 10}-${pastYear - 1}`,
        classes: {},
        iconClasses: this.leftIconClass
      },
      rightButton: {
        value: moment.utc(startDate).add(11, 'years').valueOf(),
        ariaLabel: `Go to ${futureYear + 1}-${futureYear + 10}`,
        classes: {},
        iconClasses: this.rightIconClass
      },
      rows: rowNumbers.map(rowOfYears.bind(this))
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfYears(rowNumber) {

      const currentMoment = moment.utc();
      const cells = columnNumbers.map((columnNumber) => {
        const yearMoment = moment.utc(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'years');
        return {
          display: yearMoment.format('YYYY'),
          value: yearMoment.valueOf(),
          classes: {
            today: yearMoment.isSame(currentMoment, 'year'),
          }
        };
      });
      return {cells};
    }
  }

  private monthModel(milliseconds: number): DlDateTimePickerModel {
    const startDate = moment.utc(milliseconds).startOf('year');

    const rowNumbers = [0, 1, 2];
    const columnNumbers = [0, 1, 2, 3];

    const previousYear = moment.utc(startDate).subtract(1, 'year');
    const nextYear = moment.utc(startDate).add(1, 'year');

    const result = {
      view: 'month',
      viewLabel: startDate.format('YYYY'),
      activeDate: moment.utc(milliseconds).startOf('month').valueOf(),
      leftButton: {
        value: previousYear.valueOf(),
        ariaLabel: `Go to ${previousYear.format('YYYY')}`,
        classes: {},
        iconClasses: this.leftIconClass
      },
      upButton: {
        value: 0,
        ariaLabel: `Go to year view`,
        classes: {},
        iconClasses: this.upIconClass
      },
      rightButton: {
        value: nextYear.valueOf(),
        ariaLabel: `Go to ${nextYear.format('YYYY')}`,
        classes: {},
        iconClasses: this.rightIconClass
      },
      rows: rowNumbers.map(rowOfMonths)
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfMonths(rowNumber) {

      const currentMoment = moment.utc();
      const cells = columnNumbers.map((columnNumber) => {
        const monthMoment = moment.utc(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'months');
        return {
          display: monthMoment.format('MMM'),
          ariaLabel: monthMoment.format('MMM YYYY'),
          value: monthMoment.valueOf(),
          classes: {
            today: monthMoment.isSame(currentMoment, 'month'),
          }
        };
      });
      return {cells};
    }
  }

  private dayModel(milliseconds: number): DlDateTimePickerModel {

    const startDate = moment.utc(milliseconds).startOf('month');

    const rowNumbers = [0, 1, 2];
    const columnNumbers = [0, 1, 2, 3];

    const previousMonth = moment.utc(startDate).subtract(1, 'month');
    const nextMonth = moment.utc(startDate).add(1, 'month');

    const result = {
      view: 'day',
      viewLabel: startDate.format('MMM YYYY'),
      activeDate: milliseconds,
      leftButton: {
        value: previousMonth.valueOf(),
        ariaLabel: `Go to ${previousMonth.format('MMM YYYY')}`,
        classes: {},
        iconClasses: this.leftIconClass
      },
      upButton: {
        value: 0,
        ariaLabel: `Go to month view`,
        classes: {},
        iconClasses: this.upIconClass
      },
      rightButton: {
        value: 0,
        ariaLabel: `Go to ${nextMonth.format('MMM YYYY')}`,
        classes: {},
        iconClasses: this.rightIconClass
      },
      rows: [] // rowNumbers.map(rowOfDays)
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    // function rowOfDays(rowNumber) {
    //
    //   const currentMoment = moment.utc();
    //   const cells = columnNumbers.map((columnNumber) => {
    //     const monthMoment = moment.utc(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'months');
    //     return {
    //       display: monthMoment.format('ll'),
    //       ariaLabel: monthMoment.format('LL'),
    //       value: monthMoment.valueOf(),
    //       classes: {
    //         today: monthMoment.isSame(currentMoment, 'month'),
    //       }
    //     };
    //   });
    //   return {cells};
    // }
  }

  _onDateClick(milliseconds: number) {

    if (this.minView === this._model.view) {
      this.value = milliseconds;
      this._model.view = this.startView;
    }

    switch (this._model.view) {
      case 'month':
        this._model = this.dayModel(milliseconds);
        break;
      default:
        this._model = this.monthModel(milliseconds);
    }
    this._onTouch();
  }

  _onLeftClick() {
    if (this._model.view === 'month') {
      this._model = this.monthModel(this._model.leftButton.value);
    } else {
      this._model = this.yearModel(this._model.leftButton.value);
    }
    this._onTouch();
  }

  _onUpClick() {
    this._model = this.yearModel(this._model.activeDate);
  }

  _onRightClick() {
    if (this._model.view === 'month') {
      this._model = this.monthModel(this._model.rightButton.value);
    } else {
      this._model = this.yearModel(this._model.rightButton.value);
    }
    this._onTouch();
  }

  get value() {
    return this._value;
  }

  set value(value: number) {
    this._value = value;
    this._changed.forEach(f => f(value));
    this.change.emit(new DlDateTimePickerChange(value));
  }

  writeValue(value: number) {
    this.value = value;
  }

  registerOnChange(fn: (value: number) => void) {
    this._changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this._touched.push(fn);
  }

  private _onTouch() {
    this._touched.forEach((onTouch) => onTouch());
  }

  _isActiveCell(value: number) {
    return this._model.activeDate === value;
  }

  /** Handles keydown events on the calendar body when calendar is in year view. */
  @HostListener('keydown', ['$event'])
  private _handleKeyDown($event: KeyboardEvent): void {
    switch ($event.keyCode) {
      case SPACE:
      case ENTER:
        this._onDateClick(this._model.activeDate);
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
        return;
      case PAGE_UP:
        const pageUpYear = moment.utc(this._model.activeDate).subtract(10, 'year').valueOf();
        this._model = this.yearModel(pageUpYear);
        break;
      case PAGE_DOWN:
        const pageDownYear = moment.utc(this._model.activeDate).add(10, 'year').valueOf();
        this._model = this.yearModel(pageDownYear);
        break;
      case END:
        const cells = this._model.rows[this._model.rows.length - 1].cells;
        this._model = this.yearModel(cells[cells.length - 1].value);
        break;
      case HOME:
        this._model = this.yearModel(this._model.rows[0].cells[0].value);
        break;
      case LEFT_ARROW:
        const leftYear = moment.utc(this._model.activeDate).subtract(1, 'year').valueOf();
        this._model = this.yearModel(leftYear);
        break;
      case RIGHT_ARROW:
        if (this._model.view === 'year') {
          const rightYear = moment.utc(this._model.activeDate).add(1, 'year').valueOf();
          this._model = this.yearModel(rightYear);
        } else {
          const rightMonth = moment.utc(this._model.activeDate).add(1, 'month').valueOf();
          this._model = this.monthModel(rightMonth);
        }
        break;
      case UP_ARROW:
        const upYear = moment.utc(this._model.activeDate).subtract(5, 'year').valueOf();
        this._model = this.yearModel(upYear);
        break;
      case DOWN_ARROW:
        const downYear = moment.utc(this._model.activeDate).add(5, 'year').valueOf();
        this._model = this.yearModel(downYear);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    this._focusActiveCell();
    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /** Focuses the active cell after the microtask queue is empty. */
  private _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._elementRef.nativeElement.querySelector('.active').focus();
      });
    });
  }
}

interface DlDateTimePickerModel {
  view: string;
  viewLabel: string;
  activeDate: number;
  leftButton: {
    value: number;
    ariaLabel: string;
    classes: {};
    iconClasses: {};
  };
  upButton?: {
    value: number;
    ariaLabel: string;
    classes: {};
    iconClasses: {};
  };
  rightButton: {
    value: number;
    ariaLabel: string;
    classes: {};
    iconClasses: {};
  };
  rows: Array<{
    cells: Array<{
      display: string;
      ariaLabel: string;
      value: number;
      classes: {};
    }>
  }>;
}
