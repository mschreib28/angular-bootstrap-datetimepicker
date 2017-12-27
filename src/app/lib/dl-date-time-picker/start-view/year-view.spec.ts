import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  DOWN_ARROW, END, ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  UP_ARROW
} from '../../../../testing/dispatch-events';

@Component({

  template: '<dl-date-time-picker [(ngModel)]="selectedDate" startView="year"></dl-date-time-picker>'
})
class StartViewYearComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker [(ngModel)]="selectedDate" startView="year" minView="year" maxView="year"></dl-date-time-picker>'
})
class YearSelectorComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

describe('DlDateTimePickerComponent', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        StartViewYearComponent,
        YearSelectorComponent]
    })
      .compileComponents();
  }));

  describe('startView=year', () => {
    let component: StartViewYearComponent;
    let fixture: ComponentFixture<StartViewYearComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(StartViewYearComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      nativeElement = debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should start with year-view', () => {
      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeTruthy();
    });

    it('should contain .view-label element with "2010-2019"', () => {
      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2010-2019');
    });

    it('should contain 10 .year elements', () => {
      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      expect(yearElements.length).toBe(10);
    });

    it('should contain 1 .today element for the current year', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.today'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe('2017');
      expect(currentElements[0].nativeElement.classList).toContain('1483228800000');
    });

    it('should contain 12 .year with start of year utc time as class, aria-label', () => {
      const expectedClass = [
        1262304000000,
        1293840000000,
        1325376000000,
        1356998400000,
        1388534400000,
        1420070400000,
        1451606400000,
        1483228800000,
        1514764800000,
        1546300800000
      ];

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));

      yearElements.forEach((yearElement, index) => {
        const key = expectedClass[index];
        expect(yearElement.nativeElement.classList).toContain(key.toString(10));
        expect(yearElement.attributes['role']).toBe('gridcell', index);
      });
    });

    it('should have a class for previous decade value on .left-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.nativeElement.classList).toContain('978307200000');
    });

    it('should switch to previous decade value after clicking .left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      expect(yearElements[0].nativeElement.textContent.trim()).toBe('2000');
    });

    it('should has a class for previous decade on .right-button ', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button')).nativeElement;
      expect(rightButton.classList).toContain('1609459200000');
    });

    it('should switch to next decade after clicking .right-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      expect(yearElements[0].nativeElement.textContent.trim()).toBe('2020');
    });

    it('should .left-button should contain screen reader text', () => {
      const leftScreenReaderElement = fixture.debugElement.query(By.css('.left-button > .sr-only'));
      expect(leftScreenReaderElement.nativeElement.textContent.trim()).toBe('Previous decade');
    });

    it('should .right-button should contain screen reader text', () => {
      const leftScreenReaderElement = fixture.debugElement.query(By.css('.right-button > .sr-only'));
      expect(leftScreenReaderElement.nativeElement.textContent.trim()).toBe('Next decade');
    });

    it('should not emit a change event when clicking .year', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[9].nativeElement.click(); // 2019
      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should change to .month-view when selecting year', () => {
      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[0].nativeElement.click(); // 2009
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeFalsy();
    });

    it('should change to .month-view when hitting enter', () => {
      (component.picker as any)._model.activeDate = new Date('2011-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeFalsy();
    });

    it('should have one .active element', () => {
      const activeElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(activeElements.length).toBe(1);
    });

    it('should change .active element on right arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2018');
    });

    it('should change to next decade when last .year is .active element and pressing on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2019-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', RIGHT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2020');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2020-2029');
    });

    it('should change .active element on left arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', LEFT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2016');
    });

    it('should change to previous decade when first .year is .active element and pressing on left arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2010-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', LEFT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2009');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');
    });

    it('should change .active element on up arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2012');
    });

    it('should change to previous decade when first .year is .active element and pressing on up arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2014-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', UP_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2009');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');
    });

    it('should change .active element on down arrow', () => {
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

    it('should change .active element on page-up (fn+up-arrow)', () => {
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


    it('should change .active element on page-down (fn+down-arrow)', () => {
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

    it('should change .active element to first .year on HOME', () => {
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

    it('should change .active element to first .year on END', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchFakeEvent(activeElement.nativeElement, 'focus');
      fixture.detectChanges();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2019');
    });


  });

  describe('year selector (minView=year)', () => {
    let component: YearSelectorComponent;
    let fixture: ComponentFixture<YearSelectorComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(YearSelectorComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      nativeElement = debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should be touched when clicking .left-button', () => {
      // ng-untouched/ng-touched requires ngModel
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');

      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-touched');
    });

    it('should be touched when clicking .right-button', () => {
      // ng-untouched/ng-touched requires ngModel
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');

      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-touched');
    });

    it('should be touched when clicking .year', () => {
      // ng-untouched/ng-touched requires ngModel
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');

      const yearElement = fixture.debugElement.query(By.css('.year'));
      yearElement.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-touched');
    });

    it('should be dirty when clicking .year', () => {
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');

      const yearElement = fixture.debugElement.query(By.css('.year'));
      yearElement.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-dirty');
    });

    it('should emit a change event when clicking a .year', function () {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[0].nativeElement.click();
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(1262304000000);
    });

    it('should store the value when clicking a .year', function () {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[0].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).toBe(1262304000000);
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(1262304000000);
    });

    it('should store the value when clicking a .year', function () {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[8].nativeElement.click(); //
      fixture.detectChanges();

      expect(component.picker.value).toBe(1514764800000);
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(1514764800000);
    });

    it('should store the value in ngModel when clicking a .year', () => {
      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[9].nativeElement.click(); // 2019-01-01
      fixture.detectChanges();

      expect(component.selectedDate).toBe(1546300800000);
    });

    it('should store the value in ngModel when hitting enter', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      (component.picker as any)._model.activeDate = new Date('2011-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      expect(component.picker.value).toBe(1293840000000);
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(1293840000000);
      expect(component.selectedDate).toBe(1293840000000);
    });
  });

  // tab key  - cycles between left, up, right, and active date in calendar

  // enter
  // on left, up, or right = click()

  // arrow key
  // on left, up, or right does nothing

  // page_up/down

  // up/down arrow moves up/down one row (same cell index)

  // fn + up/down arrow = left/right button click
  // fn + left/right arrow moves to the first/last date in calendar


  // home

  // end

  // Other screen reader issues - search for usability issues
});
