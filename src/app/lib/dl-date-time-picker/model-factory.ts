import {DlDateTimePickerModel} from './dl-date-time-picker-model';

export interface ModelFactory {

  getModel(milliseconds: number): DlDateTimePickerModel;

  goLeft(fromMilliseconds: number): DlDateTimePickerModel;

  goRight(fromMilliseconds: number): DlDateTimePickerModel;

  goUp(fromMilliseconds: number): DlDateTimePickerModel;

  goDown(fromMilliseconds: number): DlDateTimePickerModel;

  pageUp(fromMilliseconds: number): DlDateTimePickerModel;

  pageDown(fromMilliseconds: number): DlDateTimePickerModel;
}
