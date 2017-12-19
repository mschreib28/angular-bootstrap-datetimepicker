import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';

const viewToUpView = {
  'month': 'year',
  'day': 'month',
  'hour': 'day',
  'minute': 'hour',
};

const viewToNextView = Object
  .keys(viewToUpView)
  .reduce((previousValue: {}, key: string) => {
    previousValue[viewToUpView[key]] = key;
    return previousValue;
  }, {});

export class DlDateTimePickerChange {

  utc: number;

  constructor(milliseconds: number) {
    this.utc = milliseconds;
  }
}

@Component({
  selector: 'dl-date-time-picker',
  templateUrl: './dl-date-time-picker.component.html',
  styleUrls: ['./dl-date-time-picker.component.css']
})
export class DlDateTimePickerComponent implements OnInit {

  private _view: DlDateTimePickerView;
  private _change: EventEmitter<DlDateTimePickerChange> = new EventEmitter<DlDateTimePickerChange>();

  _model: DlDateTimePickerModel;

  @Input()
  startView: DlDateTimePickerView;

  @Input()
  dayViewLabelFormat = '2017-MMM';


  @Input()
  minuteStep = 5;

  /** Event emitted when the date/time picker's value changes. */
  @Output()
  get change(): Observable<DlDateTimePickerChange> {
    return this._change.asObservable();
  }

  get _currentView(): DlDateTimePickerView {
    return this._view || this.startView || 'day';
  }

  constructor() {
  }

  ngOnInit() {
    this._view = this._currentView;
    this._model = this.getModel(new Date().getTime());
  }

  _onUpClick() {
    this._view = viewToUpView[this._currentView] || this._view;
    this._model = this.getModel(new Date().getTime());
  }

  _onDateClick(milliseconds: number) {
    this._view = viewToNextView[this._currentView];
    this._model = this.getModel(milliseconds);
    if (!this._view) {
      const change = new DlDateTimePickerChange(milliseconds);
      this._change.emit(change);
    }
  }

  private getModel(milliseconds: number): DlDateTimePickerModel {
    const modelFunction = `${this._currentView}Model`;
    return this[modelFunction](milliseconds);
  }

  private yearModel(milliseconds: number): DlDateTimePickerModel {
    const rowNumbers = [0, 1, 2];
    const yearNumbers = [0, 1, 2, 3];

    return {
      upViewButton: {
        display: '2010-2019',
        value: 0
      },
      labels: [],
      rows: rowNumbers.map(rowOfYears)
    };

    function rowOfYears(rowNumber) {
      const startYear = moment.utc().startOf('year');

      // View starts one year before the decade starts and ends one year after the decade ends
      // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
      // Truncate the last digit from the current year and subtract 1 to get the start of the decade
      const startDecade = (Math.trunc(startYear.year() / 10) * 10) - 1;
      const startDate = moment.utc(`${startDecade}-01-01`).startOf('year');

      const futureYear = startDate.year() + 10;
      const pastYear = startDate.year() + 1;

      const currentMoment = moment.utc();
      const dates = yearNumbers.map((yearNumber) => {
        const yearMoment = moment.utc(startDate).add((rowNumber * yearNumbers.length) + yearNumber, 'years');
        return {
          'display': yearMoment.format('YYYY'),
          'value': yearMoment.valueOf(),
          'classes': {
            'current': yearMoment.isSame(currentMoment, 'year'),
            'future': yearMoment.year() > futureYear,
            'past': yearMoment.year() < pastYear,
          }
        };
      });
      return {dates};
    }
  }

  private monthModel(milliseconds: number): DlDateTimePickerModel {

    const rowNumbers = [0, 1, 2];
    const monthNumbers = [0, 1, 2, 3];

    return {
      upViewButton: {
        display: '2017',
        value: 0
      },
      labels: [],
      rows: rowNumbers.map(rowOfMonths)
    };

    function rowOfMonths(rowNumber) {
      const startDate = moment.utc().startOf('year');
      const currentMoment = moment.utc();
      const dates = monthNumbers.map((monthNumber) => {
        const monthMoment = moment.utc(startDate).add((rowNumber * monthNumbers.length) + monthNumber, 'months');
        return {
          'display': monthMoment.format('MMM'),
          'value': monthMoment.valueOf(),
          'classes': {
            'current': monthMoment.isSame(currentMoment, 'month'),
            'past': monthMoment.isBefore(startDate),
            'future': monthMoment.isAfter(startDate),
          }
        };
      });
      return {dates};
    }
  }

  private dayModel(milliseconds: number): DlDateTimePickerModel {
    const dayNumbers = [0, 1, 2, 3, 4, 5, 6];
    const rowNumbers = [0, 1, 2, 3, 4, 5];

    const startOfMonth = moment.utc().startOf('month');
    const endOfMonth = moment.utc().endOf('month');
    const startDate = moment.utc(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');
    const currentMoment = moment.utc();

    return {
      upViewButton: {
        display: startOfMonth.format(this.dayViewLabelFormat),
        value: 0
      },
      labels: dayNumbers.map((dayNumber) => moment.utc().weekday(dayNumber).format('dd')),
      rows: rowNumbers.map(rowOfDays)
    };

    function rowOfDays(rowNumber) {
      const dates = dayNumbers.map((dayNumber) => {
        const dayMoment = moment.utc(startDate).add((rowNumber * 7) + dayNumber, 'days');
        return {
          'display': dayMoment.format('D'),
          'value': dayMoment.valueOf(),
          'classes': {
            'current': dayMoment.isSame(currentMoment, 'day'),
            'past': dayMoment.isBefore(startOfMonth),
            'future': dayMoment.isAfter(endOfMonth),
          }
        };
      });
      return {dates};
    }
  }

  private hourModel(milliseconds: number): DlDateTimePickerModel {
    const hourNumbers = [0, 1, 2, 3];
    const rowNumbers = [0, 1, 2, 3, 4, 5];

    const startDate = moment.utc(milliseconds).startOf('day');
    const currentMoment = moment.utc();

    return {
      upViewButton: {
        display: startDate.format('ll'),
        value: 0
      },
      labels: [],
      rows: rowNumbers.map(rowOfHours)
    };

    function rowOfHours(rowNumber, index, rows) {
      const dates = hourNumbers.map((hourNumber) => {
        const hourMoment = moment.utc(startDate).add((rowNumber * hourNumbers.length) + hourNumber, 'hours');
        return {
          'display': hourMoment.format('LT'),
          'value': hourMoment.valueOf(),
          'classes': {
            'current': hourMoment.isSame(currentMoment, 'hour'),
          }
        };
      });
      return {dates};
    }
  }

  private minuteModel(milliseconds: number): DlDateTimePickerModel {
    const minuteNumbers = [0, 1, 2, 3];
    const rowCount = (60 / this.minuteStep) / 4;

    const rowNumbers = Array.from(Array(rowCount).keys());
    const minuteStep = this.minuteStep;
    const startDate = moment.utc(milliseconds).startOf('hour');
    const currentMoment = moment.utc();

    return {
      upViewButton: {
        display: moment.utc(milliseconds).format('lll'),
        value: 0
      },
      labels: [],
      rows: rowNumbers.map(rowOfMinutes)
    };

    function rowOfMinutes(rowNumber) {
      const dates = minuteNumbers.map((minuteNumber) => {
        const rowMinutes = (rowNumber * minuteNumbers.length * minuteStep);
        const minutes = rowMinutes + (minuteNumber * minuteStep);
        const hourMoment = moment.utc(startDate).add(minutes, 'minutes');

        return {
          'display': hourMoment.format('LT'),
          'value': hourMoment.valueOf(),
          'classes': {
            'current': hourMoment.isSame(currentMoment, 'minute'),
          }
        };
      });
      return {dates};
    }
  }
}

declare type DlDateTimePickerView = 'year' | 'month' | 'day' | 'hour' | 'minute';

interface DlDateTimePickerModel {
  upViewButton: {
    display: string;
    value: number;
  };
  labels: Array<string>;
  rows: Array<{ dates: Array<{ display: string, value: number, classes: {} }> }>;
}
