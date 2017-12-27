import {Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {take} from 'rxjs/operators';

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
    this._model = this.yearModel(new Date().getTime());
  }

  private yearModel(milliseconds: number): DlDateTimePickerModel {
    const rowNumbers = [0, 1];
    const yearNumbers = [0, 1, 2, 3, 4];

    const startYear = moment.utc(milliseconds).startOf('year');

    // View starts one year before the decade starts and ends one year after the decade ends
    // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
    // Truncate the last digit from the current year and subtract 1 to get the start of the decade
    const startDecade = (Math.trunc(startYear.year() / 10) * 10) ;

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
        classes: {},
        iconClasses: this.leftIconClass
      },
      rightButton: {
        value: moment.utc(startDate).add(11, 'years').valueOf(),
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
      const cells = yearNumbers.map((yearNumber) => {
        const yearMoment = moment.utc(startDate).add((rowNumber * yearNumbers.length) + yearNumber, 'years');
        return {
          'display': yearMoment.format('YYYY'),
          'value': yearMoment.valueOf(),
          'classes': {
            'today': yearMoment.isSame(currentMoment, 'year'),
          }
        };
      });
      return {cells};
    }
  }

  private monthModel(milliseconds: number): DlDateTimePickerModel {
    return {
      view: 'month',
      viewLabel: 'month-view',
      activeDate: milliseconds,
      leftButton: {
        value: 0,
        classes: {},
        iconClasses: this.leftIconClass
      },
      rightButton: {
        value: 0,
        classes: {},
        iconClasses: this.rightIconClass
      },
      rows: [] // rowNumbers.map(rowOfYears)
    };
  }

  _onDateClick(milliseconds: number) {
    if (!this.minView) {
      this._model = this.monthModel(milliseconds);
    } else {
      this.value = milliseconds;
    }
    this._onTouch();
  }

  _onLeftClick() {
    this._model = this.yearModel(this._model.leftButton.value);
    this._onTouch();
  }

  _onRightClick() {
    this._model = this.yearModel(this._model.rightButton.value);
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
      case LEFT_ARROW:
        const leftYear = moment.utc(this._model.activeDate).subtract(1, 'year').valueOf();
        this._model = this.yearModel(leftYear);
        break;
      case RIGHT_ARROW:
        const rightYear = moment.utc(this._model.activeDate).add(1, 'year').valueOf();
        this._model = this.yearModel(rightYear);
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
  viewLabel: string
  activeDate: number
  leftButton: {
    value: number,
    classes: {},
    iconClasses: {}
  };
  rightButton: {
    value: number,
    classes: {},
    iconClasses: {}
  };
  rows: Array<{
    cells: Array<{
      display: string,
      value: number,
      classes: {}
    }>
  }>;
}
