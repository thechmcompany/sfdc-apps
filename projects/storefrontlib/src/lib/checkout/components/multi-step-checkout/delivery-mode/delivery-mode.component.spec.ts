import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DeliveryMode, CheckoutService } from '@spartacus/core';

import { of, Observable } from 'rxjs';

import createSpy = jasmine.createSpy;

import { DeliveryModeComponent } from './delivery-mode.component';

class MockCheckoutService {
  loadSupportedDeliveryModes = createSpy();
  getSupportedDeliveryModes(): Observable<DeliveryMode[]> {
    return of();
  }
}
const mockDeliveryMode1: DeliveryMode = {
  code: 'standard-gross',
  name: 'Standard Delivery',
  deliveryCost: { formattedValue: '$10.00' }
};

const mockDeliveryMode2: DeliveryMode = {
  code: 'premium-gross',
  name: 'Premium Delivery',
  deliveryCost: { formattedValue: '$20.00' }
};

const mockSupportedDeliveryModes: DeliveryMode[] = [
  mockDeliveryMode1,
  mockDeliveryMode2
];

describe('DeliveryModeComponent', () => {
  let component: DeliveryModeComponent;
  let fixture: ComponentFixture<DeliveryModeComponent>;
  let mockCheckoutService: MockCheckoutService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [DeliveryModeComponent],
      providers: [{ provide: CheckoutService, useClass: MockCheckoutService }]
    }).compileComponents();

    mockCheckoutService = TestBed.get(CheckoutService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryModeComponent);
    component = fixture.componentInstance;

    spyOn(component.selectMode, 'emit').and.callThrough();
    spyOn(component.backStep, 'emit').and.callThrough();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit to get supported shipping modes if they do not exist', done => {
    spyOn(mockCheckoutService, 'getSupportedDeliveryModes').and.returnValue(
      of([])
    );
    component.ngOnInit();
    component.supportedDeliveryModes$.subscribe(() => {
      expect(mockCheckoutService.loadSupportedDeliveryModes).toHaveBeenCalled();
      done();
    });
  });

  it('should call ngOnInit to get supported shipping modes if they exist', () => {
    spyOn(mockCheckoutService, 'getSupportedDeliveryModes').and.returnValue(
      of(mockSupportedDeliveryModes)
    );
    component.ngOnInit();
    let deliveryModes: DeliveryMode[];
    component.supportedDeliveryModes$.subscribe(data => {
      deliveryModes = data;
    });
    expect(deliveryModes).toBe(mockSupportedDeliveryModes);
  });

  it('should call ngOnInit to set shipping mode if user selected it before', done => {
    const mockSelectedShippingMethod = 'shipping method set in cart';
    component.selectedShippingMethod = mockSelectedShippingMethod;
    spyOn(mockCheckoutService, 'getSupportedDeliveryModes').and.returnValue(
      of(mockSupportedDeliveryModes)
    );
    component.ngOnInit();
    component.supportedDeliveryModes$.subscribe(() => {
      expect(component.mode.controls['deliveryModeId'].value).toEqual(
        mockSelectedShippingMethod
      );
      done();
    });
  });

  it('should stop supportedDeliveryModes subscription when leave this component even they do not exist', () => {
    spyOn(mockCheckoutService, 'getSupportedDeliveryModes').and.returnValue(
      of([])
    );
    component.ngOnInit();
    component.supportedDeliveryModes$.subscribe();
    component.leave = true;
    // subscription is end
    expect(mockCheckoutService.loadSupportedDeliveryModes.calls.count()).toBe(
      1
    );
  });

  it('should call next()', () => {
    component.next();
    expect(component.selectMode.emit).toHaveBeenCalledWith(
      component.mode.value
    );
  });

  it('should call back()', () => {
    component.back();
    expect(component.backStep.emit).toHaveBeenCalled();
    expect(component.leave).toBe(true);
  });

  it('should get deliveryModeInvalid()', () => {
    const invalid = component.deliveryModeInvalid;
    expect(invalid).toBe(true);
  });

  describe('UI continue button', () => {
    const getContinueBtn = () =>
      fixture.debugElement.query(
        By.css('.cx-delivery-mode-form__btns .btn-primary')
      );

    it('should be disabled when delivery mode is not selected', () => {
      component.mode.controls['deliveryModeId'].setValue(null);
      fixture.detectChanges();
      expect(getContinueBtn().nativeElement.disabled).toBe(true);
    });

    it('should be enabled when delivery mode is selected', () => {
      component.mode.controls['deliveryModeId'].setValue('test delivery mode');
      fixture.detectChanges();
      expect(getContinueBtn().nativeElement.disabled).toBe(false);
    });

    it('should call "next" function after being clicked', () => {
      spyOn(component, 'next');
      getContinueBtn().nativeElement.click();
      fixture.detectChanges();
      expect(component.next).toHaveBeenCalled();
    });
  });

  describe('UI back button', () => {
    const getContinueBtn = () =>
      fixture.debugElement.query(
        By.css('.cx-delivery-mode-form__btns .btn-action')
      );

    it('should call "back" function after being clicked', () => {
      spyOn(component, 'back');
      getContinueBtn().nativeElement.click();
      fixture.detectChanges();
      expect(component.back).toHaveBeenCalled();
    });
  });
});
