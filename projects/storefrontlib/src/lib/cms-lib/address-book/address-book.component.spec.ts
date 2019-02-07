import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { StoreModule } from '@ngrx/store';

import {
  UserService,
  CheckoutService,
  Address,
  AddressValidation,
  User
} from '@spartacus/core';
import { GlobalMessageService } from '@spartacus/core';

import { BehaviorSubject, of } from 'rxjs';

import { SpinnerModule } from '../../ui/components/spinner/spinner.module';
import { AddressFormModule } from '../../checkout/components/multi-step-checkout/shipping-address/address-form/address-form.module';

import { AddressBookComponent } from './address-book.component';
import { AddressBookModule } from './address-book.module';

const mockAddress: Address = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'Toyosaki 2 create on cart',
  line2: 'line2',
  town: 'town',
  region: { isocode: 'JP-27' },
  postalCode: 'zip',
  country: { isocode: 'JP' },
  defaultAddress: false
};

class MockCheckoutService {
  clearAddressVerificationResults = jasmine.createSpy();

  verifyAddress = jasmine.createSpy();

  getAddressVerificationResults(): BehaviorSubject<AddressValidation> {
    return new BehaviorSubject({ decision: 'ACCEPT' });
  }
}

describe('AddressBookComponent', () => {
  let component: AddressBookComponent;
  let fixture: ComponentFixture<AddressBookComponent>;
  let mockUserService: any;
  let el: DebugElement;
  let mockGlobalMessageService: any;
  const addresses = new BehaviorSubject<Address[]>([mockAddress]);
  const isLoading = new BehaviorSubject<boolean>(false);
  const user = new BehaviorSubject<User>({ uid: 'userId' });

  beforeEach(async(() => {
    mockUserService = {
      getAddresses: jasmine.createSpy().and.returnValue(addresses),
      getAddressesLoading: jasmine.createSpy().and.returnValue(isLoading),
      get: jasmine.createSpy().and.returnValue(user),
      addUserAddress: jasmine.createSpy(),
      loadAddresses: jasmine.createSpy(),
      deleteUserAddress: jasmine.createSpy(),
      updateUserAddress: jasmine.createSpy(),
      setAddressAsDefault: jasmine.createSpy(),
      getDeliveryCountries: jasmine.createSpy().and.returnValue(of([])),
      getTitles: jasmine.createSpy().and.returnValue(of([])),
      getRegions: jasmine.createSpy().and.returnValue(of([])),
      loadTitles: jasmine.createSpy(),
      loadDeliveryCountries: jasmine.createSpy(),
      loadRegions: jasmine.createSpy()
    };

    mockGlobalMessageService = {
      add: jasmine.createSpy()
    };

    TestBed.configureTestingModule({
      imports: [
        AddressBookModule,
        AddressFormModule,
        SpinnerModule,
        StoreModule.forRoot({})
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: CheckoutService, useClass: MockCheckoutService },
        { provide: GlobalMessageService, useValue: mockGlobalMessageService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show spinner if addresses are loading', () => {
    component.ngOnInit();
    isLoading.next(true);
    fixture.detectChanges();
    expect(el.query(By.css('cx-spinner'))).toBeTruthy();
  });

  it('should show spinner if any action is processing', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(el.query(By.css('cx-spinner'))).toBeTruthy();
  });

  it('should show address cards after loading', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress, mockAddress]);
    fixture.detectChanges();
    expect(el.query(By.css('cx-address-card'))).toBeTruthy();
  });

  it('should address cards number to be equal with addresses count', () => {
    component.ngOnInit();
    addresses.next([mockAddress, mockAddress]);
    fixture.detectChanges();

    expect(el.queryAll(By.css('cx-address-card')).length).toEqual(2);
  });

  it('should show confirmation on delete', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress]);
    fixture.detectChanges();
    el.query(By.css('.cx-address-card__actions .delete')).nativeElement.click();
    fixture.detectChanges();
    expect(
      el.query(By.css('.cx-address-card__delete-msg')).nativeElement.textContent
    ).toContain('Are you sure you want to delete this address?');
  });

  it('should show adding address form', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress]);
    fixture.detectChanges();
    el.query(By.css('.btn-action')).nativeElement.click();
    fixture.detectChanges();
    expect(
      el.query(By.css('cx-address-form')).nativeElement.textContent
    ).toContain('Add address');
    expect(component.isAddAddressFormOpen).toBeTruthy();
  });

  it('should hide adding address form', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress]);
    fixture.detectChanges();
    el.query(By.css('.btn-action')).nativeElement.click();
    fixture.detectChanges();
    el.queryAll(
      By.css('.cx-address-form__btns button')
    )[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.isAddAddressFormOpen).toBeFalsy();
  });

  it('should show editing address form', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress]);
    fixture.detectChanges();
    el.query(By.css('.cx-address-card__actions .edit')).nativeElement.click();
    fixture.detectChanges();
    expect(
      el.query(By.css('cx-address-form')).nativeElement.textContent
    ).toContain('Update address');
    expect(component.isEditAddressFormOpen).toBeTruthy();
  });

  it('should hide editing address form', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress]);
    fixture.detectChanges();
    el.query(By.css('.cx-address-card__actions .edit')).nativeElement.click();
    fixture.detectChanges();
    el.queryAll(
      By.css('.cx-address-form__btns button')
    )[0].nativeElement.click();
    fixture.detectChanges();
    expect(component.isEditAddressFormOpen).toBeFalsy();
  });

  it('should successfully set address as default', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress]);
    fixture.detectChanges();
    el.query(
      By.css('.cx-address-card__actions .set-default')
    ).nativeElement.click();
    fixture.detectChanges();
    expect(mockUserService.setAddressAsDefault).toHaveBeenCalledWith(
      'userId',
      mockAddress.id
    );
  });

  it('should successfully delete address', () => {
    component.ngOnInit();
    isLoading.next(false);
    addresses.next([mockAddress]);
    fixture.detectChanges();
    el.query(By.css('.cx-address-card__actions .delete')).nativeElement.click();
    fixture.detectChanges();
    el.query(
      By.css('.cx-address-card__delete .btn-primary')
    ).nativeElement.click();
    fixture.detectChanges();
    expect(mockUserService.deleteUserAddress).toHaveBeenCalledWith(
      'userId',
      mockAddress.id
    );
  });
});
