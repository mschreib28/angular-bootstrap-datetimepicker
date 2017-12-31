import {ModelFactory} from './model-factory';
import * as moment from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';

export class MonthModelFactory implements ModelFactory {

  getModel(milliseconds: number): DlDateTimePickerModel {
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
      },
      upButton: {
        value: startDate.valueOf(),
        ariaLabel: `Go to year view`,
        classes: {},
      },
      rightButton: {
        value: nextYear.valueOf(),
        ariaLabel: `Go to ${nextYear.format('YYYY')}`,
        classes: {},
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

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(1, 'month').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(1, 'month').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return undefined;
  }

}
