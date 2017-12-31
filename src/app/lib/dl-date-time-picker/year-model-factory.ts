import {ModelFactory} from './model-factory';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import * as moment from 'moment';

export class YearModelFactory implements ModelFactory {

  getModel(milliseconds: number): DlDateTimePickerModel {
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
      },
      rightButton: {
        value: moment.utc(startDate).add(11, 'years').valueOf(),
        ariaLabel: `Go to ${futureYear + 1}-${futureYear + 10}`,
        classes: {},
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

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(5, 'year').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(5, 'year').valueOf());
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(1, 'year').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(1, 'year').valueOf());
  }


  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(10, 'year').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(10, 'year').valueOf());
  }

}
