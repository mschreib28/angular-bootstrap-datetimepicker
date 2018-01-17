import {ModelFactory} from './model-factory';
import * as moment from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';

export class HourModelFactory implements ModelFactory {

  getModel(milliseconds: number): DlDateTimePickerModel {
    const startDate = moment.utc(milliseconds).startOf('day');

    const rowNumbers = [0, 1, 2, 3, 4, 5];
    const columnNumbers = [0, 1, 2, 3];

    const previousDay = moment.utc(startDate).subtract(1, 'day');
    const nextDay = moment.utc(startDate).add(1, 'day');

    const result: DlDateTimePickerModel = {
      view: 'hour',
      viewLabel: startDate.format('ll'),
      activeDate: moment.utc(milliseconds).startOf('hour').valueOf(),
      leftButton: {
        value: previousDay.valueOf(),
        ariaLabel: `Go to ${previousDay.format('ll')}`,
        classes: {},
      },
      upButton: {
        value: startDate.valueOf(),
        ariaLabel: `Go to year view`,
        classes: {},
      },
      rightButton: {
        value: nextDay.valueOf(),
        ariaLabel: `Go to ${nextDay.format('ll')}`,
        classes: {},
      },
      rows: rowNumbers.map(rowOfHours)
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfHours(rowNumber) {

      const currentMoment = moment.utc();
      const cells = columnNumbers.map((columnNumber) => {
        const hourMoment = moment.utc(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'hours');
        return {
          display: hourMoment.format('LT'),
          ariaLabel: hourMoment.format('LLL'),
          value: hourMoment.valueOf(),
          classes: {
            today: hourMoment.isSame(currentMoment, 'hour'),
          }
        };
      });
      return {cells};
    }
  }

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(4, 'hour').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(4, 'hour').valueOf());
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(1, 'hour').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(1, 'hour').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(12, 'hours').valueOf());
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(12, 'hours').valueOf());
  }

  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds)
      .endOf('day')
      .subtract(1, 'hour')
      .valueOf());
  }

  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).startOf('day').valueOf());
  }
}
