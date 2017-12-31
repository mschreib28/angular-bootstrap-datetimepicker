import {ModelFactory} from './model-factory';
import * as moment from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';

export class DayModelFactory implements ModelFactory {
  getModel(milliseconds: number): DlDateTimePickerModel {

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
      },
      upButton: {
        value: 0,
        ariaLabel: `Go to month view`,
        classes: {},
      },
      rightButton: {
        value: 0,
        ariaLabel: `Go to ${nextMonth.format('MMM YYYY')}`,
        classes: {},
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

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }
}
