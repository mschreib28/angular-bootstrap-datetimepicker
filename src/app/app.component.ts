import {Component, OnInit, ViewChild} from '@angular/core';
import {DlDateTimePickerComponent} from './lib/dl-date-time-picker/dl-date-time-picker.component';

@Component({
  selector: 'dl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dale Lotts\' angular bootstrap date & time picker';
  startView = 'year';
  selectedDate =  1514160000000;
}
