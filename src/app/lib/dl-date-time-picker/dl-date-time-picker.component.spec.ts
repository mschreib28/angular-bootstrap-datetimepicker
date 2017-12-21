// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
//
// import {DlDateTimePickerComponent} from './dl-date-time-picker.component';
// import {By} from '@angular/platform-browser';
// import {DebugElement} from '@angular/core';
// import moment = require('moment');
//
// // keyboard navigation with arrow keys
// // keyboard selection (enter)
// // what does tab key do?
// // screen reader for all cells
// // multiple languages
// // format for up-button text
// // footer content (today button example)
// // left, right, and up icon templates (and examples if using font-awesome, etc)
// // Generic type for the class
// // multiple moment configurations on the same page
// // right-to-left calendar?
// // override model functions?
//
// describe('DlDateTimePickerComponent default configuration', () => {
//   let component: DlDateTimePickerComponent;
//   let fixture: ComponentFixture<DlDateTimePickerComponent>;
//   let debugElement: DebugElement;
//   let nativeElement: any;
//
//   beforeEach(async(() => {
//     return TestBed.configureTestingModule({
//       declarations: [DlDateTimePickerComponent]
//     })
//       .compileComponents();
//   }));
//
//   beforeEach(() => {
//     fixture = TestBed.createComponent(DlDateTimePickerComponent);
//     component = fixture.componentInstance;
//     debugElement = fixture.debugElement;
//     nativeElement = debugElement.nativeElement;
//     fixture.detectChanges();
//   });
//
//   it('should start with day view', () => {
//     const dayView = fixture.debugElement.query(By.css('.day-view'));
//     expect(dayView).toBeTruthy();
//   });
//
//   it('should change to .month-view when .up-button element is clicked after drilling up through all views', () => {
//     const upView = fixture.debugElement.query(By.css('.up-button'));
//     upView.nativeElement.click();
//     fixture.detectChanges();
//
//     const monthView = fixture.debugElement.query(By.css('.month-view'));
//     expect(monthView).toBeTruthy();
//
//     const upButton = fixture.debugElement.query(By.css('.up-button')).nativeElement;
//     const text = moment().format('YYYY');
//     expect(upButton.textContent.trim()).toMatch(new RegExp(`^${text}*`));
//   });
//
//   it('should change to .year-view when .up-button element is clicked after drilling up through all views', () => {
//     const upView = fixture.debugElement.query(By.css('.up-button'));
//     upView.nativeElement.click();
//     fixture.detectChanges();
//
//     const dayView = fixture.debugElement.query(By.css('.day-view'));
//     expect(dayView).toBeFalsy();
//
//     const monthView = fixture.debugElement.query(By.css('.month-view'));
//     expect(monthView).toBeTruthy();
//
//     upView.nativeElement.click();
//     fixture.detectChanges();
//
//     let yearView = fixture.debugElement.query(By.css('.year-view'));
//     expect(yearView).toBeTruthy();
//
//     // nothing should happen when clicking up-button in year-view
//     upView.nativeElement.click();
//     fixture.detectChanges();
//
//     yearView = fixture.debugElement.query(By.css('.year-view'));
//     expect(yearView).toBeTruthy();
//   });
//
//   it('should have starting time value class for each year in .year-view', () => {
//     const upView = fixture.debugElement.query(By.css('.up-button'));
//     upView.nativeElement.click();
//     fixture.detectChanges();
//
//     const months = fixture.debugElement.queryAll(By.css('.month'));
//
//     const monthStarts = [
//       1483228800000, // 2017-01-01
//       1485907200000, // ....
//       1488326400000,
//       1491004800000,
//       1493596800000,
//       1496275200000,
//       1498867200000,
//       1501545600000,
//       1504224000000,
//       1506816000000,
//       1509494400000,
//       1512086400000
//     ];
//
//     months.map((element, index) => {
//       const key = monthStarts[index];
//       expect(element.classes[key]).toBe(true, element.classes);
//     });
//   });
//
//
//   it('should have starting time value class for each month in .month-view', () => {
//     const upView = fixture.debugElement.query(By.css('.up-button'));
//     upView.nativeElement.click();
//     fixture.detectChanges();
//
//     const months = fixture.debugElement.queryAll(By.css('.month'));
//
//     const monthStarts = [
//       1483228800000, // 2017-01-01
//       1485907200000, // ....
//       1488326400000,
//       1491004800000,
//       1493596800000,
//       1496275200000,
//       1498867200000,
//       1501545600000,
//       1504224000000,
//       1506816000000,
//       1509494400000,
//       1512086400000
//     ];
//
//     months.map((element, index) => {
//       const key = monthStarts[index];
//       expect(element.classes[key]).toBe(true, element.classes);
//     });
//   });
//
//   it('should display selected month when selecting month from .month-view', () => {
//     const upView = fixture.debugElement.query(By.css('.up-button'));
//     upView.nativeElement.click();
//     fixture.detectChanges();
//
//     const months = fixture.debugElement.queryAll(By.css('.month'));
//     months[9].nativeElement.click(); // October
//     fixture.detectChanges();
//
//     const days = fixture.debugElement.queryAll(By.css('.day'));
//
//     const dayStarts = [ // Just sampling dates
//       { index: 0, value: 1506816000000 }, // 2017-10-01
//       { index: 41, value: 1510358400000 }, // 2017-11-11
//     ];
//
//     dayStarts.map((dayStart) => {
//       const day = days[dayStart.index];
//       const key = dayStart.value;
//       expect(day.classes[key]).toBe(true, day.classes);
//     });
//   });
//
//   it('should change to hour-view when .day element is clicked', function () {
//     const days = fixture.debugElement.queryAll(By.css('.day'));
//     days[0].nativeElement.click();
//     fixture.detectChanges();
//
//     const hourView = fixture.debugElement.query(By.css('.hour-view'));
//     expect(hourView).toBeTruthy();
//
//     const upButton = fixture.debugElement.query(By.css('.up-button')).nativeElement;
//     // Starting with Dec 2017 so the 0'th day is Nov 26.
//     const text = moment('2017-11-26').format('ll');
//     expect(upButton.textContent.trim()).toMatch(new RegExp(`^${text}*`));
//
//     const hours = fixture.debugElement.queryAll(By.css('.hour'));
//     expect(hours[0].nativeElement.textContent.trim()).toBe('12:00 AM');
//     expect(hours[4].nativeElement.textContent.trim()).toBe('4:00 AM');
//     expect(hours[8].nativeElement.textContent.trim()).toBe('8:00 AM');
//     expect(hours[12].nativeElement.textContent.trim()).toBe('12:00 PM');
//     expect(hours[16].nativeElement.textContent.trim()).toBe('4:00 PM');
//     expect(hours[20].nativeElement.textContent.trim()).toBe('8:00 PM');
//     expect(hours[23].nativeElement.textContent.trim()).toBe('11:00 PM');
//   });
//
//   it('should change to minute-view when .minute element is clicked', function () {
//     const days = fixture.debugElement.queryAll(By.css('.day'));
//     days[0].nativeElement.click();  // 2017-11-26
//     fixture.detectChanges();
//
//     const hours = fixture.debugElement.queryAll(By.css('.hour'));
//     hours[14].nativeElement.click(); // 2:00 pm
//     fixture.detectChanges();
//
//     const minuteView = fixture.debugElement.query(By.css('.minute-view'));
//     expect(minuteView).toBeTruthy();
//
//     const upButton = fixture.debugElement.query(By.css('.up-button')).nativeElement;
//     // Starting with Dec 2017 so the 0'th day is Nov 26.
//     const text = moment('2017-11-26T14:00').format('lll');
//     expect(upButton.textContent.trim()).toMatch(new RegExp(`^${text}*`));
//
//     const minutes = fixture.debugElement.queryAll(By.css('.minute'));
//     expect(minutes[0].nativeElement.textContent.trim()).toBe('2:00 PM');
//     expect(minutes[4].nativeElement.textContent.trim()).toBe('2:20 PM');
//     expect(minutes[8].nativeElement.textContent.trim()).toBe('2:40 PM');
//     expect(minutes[11].nativeElement.textContent.trim()).toBe('2:55 PM');
//   });
//
//   it('should raise change event when .minute element is clicked after drilling down through all views', () => {
//     const changeSpy = jasmine.createSpy('change listener');
//     component.change.subscribe(changeSpy);
//
//     const days = fixture.debugElement.queryAll(By.css('.day'));
//     days[0].nativeElement.click();  // 2017-11-26
//     fixture.detectChanges();
//
//     const hourView = fixture.debugElement.query(By.css('.hour-view'));
//     expect(hourView).toBeTruthy();
//     expect(changeSpy).not.toHaveBeenCalled();
//
//     const hours = fixture.debugElement.queryAll(By.css('.hour'));
//     hours[14].nativeElement.click();  // 2:00 PM
//     fixture.detectChanges();
//
//     const minuteView = fixture.debugElement.query(By.css('.minute-view'));
//     expect(minuteView).toBeTruthy();
//     expect(changeSpy).not.toHaveBeenCalled();
//
//     const minutes = fixture.debugElement.queryAll(By.css('.minute'));
//     minutes[11].nativeElement.click(); // 2:55 PM
//     fixture.detectChanges();
//
//     expect(changeSpy).toHaveBeenCalled();
//     expect(changeSpy.calls.first().args[0].utc).toBe(1511708100000);
//
//     // expect(nativeElement.dirty)
//     //  .toBe(true, `Expected control to become dirty when time was selected by CLICK.`);
//
//     // should also revert back to day view.
//     const dayView = fixture.debugElement.query(By.css('.day-view'));
//     expect(dayView).toBeTruthy();
//   });
//
//   it('should have .up-button label matching this month', () => {
//     const upButton = fixture.debugElement.query(By.css('.up-button')).nativeElement;
//     const text = moment().format(component.dayViewLabelFormat);
//     expect(upButton.textContent.trim()).toMatch(new RegExp(`^${text}*`));
//   });
//
//   it('should have 42 .day elements', () => {
//     const dayElements = fixture.debugElement.queryAll(By.css('.day'));
//     expect(dayElements.length).toBe(42);
//   });
//
//   it('should have 5 .past elements', () => {
//     const pastElements = fixture.debugElement.queryAll(By.css('.past'));
//     expect(pastElements.length).toBe(5);
//   });
//
//   it('should have 6 .future elements', () => {
//     const futureElements = fixture.debugElement.queryAll(By.css('.future'));
//     expect(futureElements.length).toBe(6);
//   });
//
//   // it('should change to the previous month when .previous-button is clicked', () => {
//   //   let previousButton = fixture.debugElement.query(By.css('.previous-button'));
//   //   previousButton.nativeElement.click();
//   //   fixture.detectChanges();
//   //   let upView = fixture.debugElement.query(By.css('.up-button')).nativeElement;
//   //   expect(upView.textContent).toBe('2017-Nov') //(moment().subtract(1, 'month').format('YYYY-MMM'));
//   // })
// });
