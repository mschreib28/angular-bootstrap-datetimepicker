import {Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {take} from 'rxjs/operators';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {YearModelFactory} from './year-model-factory';
import {MonthModelFactory} from './month-model-factory';
import {DayModelFactory} from './day-model-factory';

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
  leftIconClasses = {
    'oi': true,
    'oi-chevron-left': true
  };

  upIconClasses = {
    'oi': true,
    'oi-chevron-top': true
  };

  // @Input()
  rightIconClasses = {
    'oi': true,
    'oi-chevron-right': true
  };

  private _changed: ((value: number) => void)[] = [];
  private _model: DlDateTimePickerModel;
  private _touched: (() => void)[] = [];
  private _value: number;

  private _viewToFactory = {
    year: new YearModelFactory(),
    month: new MonthModelFactory(),
    day: new DayModelFactory()
  };

  private _nextView = {
    'year': 'month',
    'month': 'day'
  };

  private _previousView = {
    'day': 'month',
    'month': 'year'
  };

  constructor(private _elementRef: ElementRef,
              private _ngZone: NgZone) {

  }

  ngOnInit(): void {
    this._model = this._viewToFactory[this.startView || 'year'].getModel(moment.utc().valueOf());
  }

  _onDateClick(milliseconds: number) {

    if (this.minView === this._model.view) {
      this.value = milliseconds;
      this._model.view = this.startView;
    }

    this._model = this._viewToFactory[this._nextView[this._model.view]].getModel(milliseconds);
    this._onTouch();
  }

  _onLeftClick() {
    this._model = this._viewToFactory[this._model.view].getModel(this._model.leftButton.value);
    this._onTouch();
  }

  _onUpClick() {
    this._model = this._viewToFactory[this._previousView[this._model.view]].getModel(this._model.upButton.value);
  }

  _onRightClick() {
    this._model = this._viewToFactory[this._model.view].getModel(this._model.rightButton.value);
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

  _handleKeyDown($event: KeyboardEvent): void {
    const currentViewFactory = this._viewToFactory[this._model.view];
    switch ($event.keyCode) {
      case SPACE:
      case ENTER:
        this._onDateClick(this._model.activeDate);
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
        return;
      case PAGE_UP:
        this._model = currentViewFactory.pageUp(this._model.activeDate);
        break;
      case PAGE_DOWN:
        this._model = currentViewFactory.pageDown(this._model.activeDate);
        break;
      case END:
        const cells = this._model.rows[this._model.rows.length - 1].cells;
        this._model = currentViewFactory.getModel(cells[cells.length - 1].value);
        break;
      case HOME:
        this._model = currentViewFactory.getModel(this._model.rows[0].cells[0].value);
        break;
      case LEFT_ARROW:
        this._model = currentViewFactory.goLeft(this._model.activeDate);
        break;
      case RIGHT_ARROW:
        this._model = currentViewFactory.goRight(this._model.activeDate);
        break;
      case UP_ARROW:
        this._model = currentViewFactory.goUp(this._model.activeDate);
        break;
      case DOWN_ARROW:
        this._model = currentViewFactory.goDown(this._model.activeDate);
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
