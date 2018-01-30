import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

@Component({

  template: '<dl-date-time-picker startView="month" minView="month" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class MonthMinViewComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

describe('DlDateTimePickerComponent minView=month', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        MonthMinViewComponent,
      ]
    })
      .compileComponents();
  }));

  describe('default behavior ', () => {
    let component: MonthMinViewComponent;
    let fixture: ComponentFixture<MonthMinViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MonthMinViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    xit('should start with month-view', () => {
      // no other options are specified and month-view is a higher level view than
      // day view (the default start view)
      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();
    });

    it('should store the value in ngModel when clicking a .month', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      expect(component.picker.value).toBeUndefined();

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      monthElements[9].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).not.toBeUndefined();
      expect(component.picker.value).toBe(component.selectedDate);
      expect(changeSpy).toHaveBeenCalled();
    });
  });
});
