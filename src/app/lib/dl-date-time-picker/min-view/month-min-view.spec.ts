import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import * as moment from 'moment';
import {
  dispatchFakeEvent, dispatchKeyboardEvent, DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, SPACE,
  UP_ARROW
} from '../../../../testing/dispatch-events';

@Component({

  template: '<dl-date-time-picker startView="month"></dl-date-time-picker>'
})
class MonthStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker startView="year"></dl-date-time-picker>'
})
class YearStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

// @Component({
//   template: '<dl-date-time-picker [(ngModel)]="selectedDate" startView="month" minView="month"></dl-date-time-picker>'
// })
// class MonthSelectorComponent {
//   selectedDate: number;
//   @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
// }

describe('DlDateTimePickerComponent startView=month', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        MonthStartViewComponent,
        YearStartViewComponent]
    })
      .compileComponents();
  }));

  describe('default behavior ', () => {
    let component: MonthStartViewComponent;
    let fixture: ComponentFixture<MonthStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(MonthStartViewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      nativeElement = debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should start with month-view', () => {
      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();
    });

    it('should contain .view-label element with "2017"', () => {
      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2017');
    });

    it('should contain 12 .month elements', () => {
      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements.length).toBe(12);
    });

    it('should contain 1 .today element for the current month', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.today'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe('Dec');
      expect(currentElements[0].nativeElement.classList).toContain('1512086400000');
    });

    it('should contain 12 .month elements with start of month utc time as class and role of gridcell', () => {

      const expectedClass = [
        1483228800000,
        1485907200000,
        1488326400000,
        1491004800000,
        1493596800000,
        1496275200000,
        1498867200000,
        1501545600000,
        1504224000000,
        1506816000000,
        1509494400000,
        1512086400000
      ];

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements.length).toBe(12);

      monthElements.forEach((monthElement, index) => {
        const key = expectedClass[index];
        const ariaLabel = moment.utc(key).format('MMM YYYY');
        expect(monthElement.nativeElement.classList).toContain(key.toString(10));
        expect(monthElement.attributes['role']).toBe('gridcell', index);
        expect(monthElement.attributes['aria-label']).toBe(ariaLabel, index);
      });
    });

    it('.left-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2016');
    });

    it('.left-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2016');
    });

    it('should have a class for previous year value on .left-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.nativeElement.classList).toContain('1451606400000');
    });

    it('should switch to previous year value after clicking .left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain('1451606400000');
    });

    it('.right-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2018');
    });

    it('.right-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2018');
    });

    it('should switch to next year value after clicking .right-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain('1514764800000');
    });

    it('.up-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.up-button'));
      expect(leftButton.attributes['title']).toBe('Go to year view');
    });

    it('.up-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.up-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to year view');
    });

    it('should switch to year view after clicking .up-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.up-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2010-2019');

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeTruthy();
    });

    it('should not emit a change event when clicking .month', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      monthElements[9].nativeElement.click(); // OCT
      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should change to .day-view when selecting .month', () => {
      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      monthElements[0].nativeElement.click(); // 2009
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeFalsy();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeTruthy();
    });

    it('should have one .active element', () => {
      const activeElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(activeElements.length).toBe(1);
    });

    it('should change .active element on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2017-10-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Oct');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Nov');
    });

    xit('should change to next decade when last .year is .active element and pressing on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2019-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', RIGHT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2020');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2020-2029');
    });

    xit('should change .active element on left arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', LEFT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2016');
    });

    xit('should change to previous decade when first .year is .active element and pressing on left arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2010-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', LEFT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2009');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');
    });

    xit('should change .active element on up arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2012');
    });

    xit('should change to previous decade when first .year is .active element and pressing on up arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2014-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', UP_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2009');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');
    });

    xit('should change .active element on down arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2014-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2014');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2019');
    });

    xit('should change .active element on page-up (fn+up-arrow)', () => {
      (component.picker as any)._model.activeDate = new Date('2016-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2016');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_UP);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2006');
    });


    xit('should change .active element on page-down (fn+down-arrow)', () => {
      (component.picker as any)._model.activeDate = new Date('2016-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2016');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_DOWN);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2026');
    });

    xit('should change .active element to first .year on HOME', () => {
      (component.picker as any)._model.activeDate = new Date('2016-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2016');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', HOME);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2010');
    });

    xit('should change .active element to first .year on END', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2019');
    });

    xit('should do nothing when hitting non-supported key', () => {
      (component.picker as any)._model.activeDate = new Date('2017-12-01').getTime();
      fixture.detectChanges();

      let activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Jan');

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', 65); // A
      fixture.detectChanges();

      activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Jan');
    });

    xit('should change to .day-view when hitting ENTER', () => {
      (component.picker as any)._model.activeDate = new Date('1966-12-06').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeFalsy();

      const yearView = fixture.debugElement.query(By.css('.day-view'));
      expect(yearView).toBeFalsy();
    });

    xit('should change to .month-view when hitting SPACE', () => {
      (component.picker as any)._model.activeDate = new Date('2011-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', SPACE);
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeFalsy();
    });
  });

  describe('startView=year', () => {
    let component: YearStartViewComponent;
    let fixture: ComponentFixture<YearStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(YearStartViewComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      nativeElement = debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should switch to previous year value after clicking .left-button', () => {
      // start at year, so select the first year
      const year = fixture.debugElement.query(By.css('.year'));
      year.nativeElement.click();
      fixture.detectChanges();

      const viewLabel2017 = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel2017.nativeElement.textContent.trim()).toBe('2010');

      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel2016 = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel2016.nativeElement.textContent.trim()).toBe('2009');

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain('1230768000000');
    });

    it('should switch to next year value after clicking .right-button', () => {
      // start at year, so select the first year
      const year = fixture.debugElement.query(By.css('.year'));
      year.nativeElement.click();
      fixture.detectChanges();

      const viewLabel2017 = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel2017.nativeElement.textContent.trim()).toBe('2010');

      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel2016 = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel2016.nativeElement.textContent.trim()).toBe('2011');

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain('1293840000000');
    });

  });
});
