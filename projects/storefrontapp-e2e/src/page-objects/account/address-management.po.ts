import {
  browser,
  by,
  element,
  ElementFinder,
  ElementArrayFinder
} from 'protractor';
import { AppPage } from '../app.po';
import { E2EUtil } from '../../e2e-util';
import { AddressForm } from '../checkout/address-form.po';

export class AddressBookPage extends AppPage {
  readonly page: ElementFinder = element(by.tagName('cx-address-book-page'));

  readonly addressDeck: ElementFinder = this.page.element(
    by.css('.cx-address-deck')
  );

  readonly menuItem: ElementFinder = element(
    by.cssContainingText('.cx-navigation__child-item a', 'Address Book')
  );

  readonly openNewAddressFormBtn: ElementFinder = element(
    by.css('.btn-action')
  );

  readonly addAddressActionBtn: ElementFinder = this.page.element(
    by.css('cx-address-form .btn-primary')
  );

  readonly addressCards: ElementArrayFinder = this.page.all(
    by.css('cx-address-card')
  );

  readonly openEditAddressFormBtn: ElementArrayFinder = this.page.all(
    by.css('.btn-link.edit')
  );

  readonly deleteAddressBtn: ElementArrayFinder = this.page.all(
    by.css('.btn-link.delete')
  );

  readonly deleteAddressConfirmationBtn: ElementFinder = this.page.element(
    by.css('.cx-address-card__delete .btn-primary')
  );

  readonly setAsDefaultBtn: ElementFinder = this.page.element(
    by.css('.btn-link.set-default')
  );

  async navigateTo() {
    await browser.get('/my-account/address-book');
    await this.waitForReady();
  }

  async waitForReady() {
    await E2EUtil.wait4VisibleElement(this.addressDeck);
  }

  async addNewAddress(addressForm: AddressForm) {
    await addressForm.waitForReady();
    await addressForm.fillIn();
    await this.addAddressActionBtn.click();
    await this.waitForReady();
  }

  async updateAddress(addressForm: AddressForm) {
    await this.openEditAddressFormBtn.get(1).click();
    await addressForm.waitForReady();
    await addressForm.firstName.sendKeys('Updated');
    await addressForm.setTitle('Mr.');
    await this.addAddressActionBtn.click();
    await this.waitForReady();
  }

  async deleteAddress() {
    await this.deleteAddressBtn.get(0).click();
    await this.deleteAddressConfirmationBtn.click();
    await this.waitForReady();
  }
}
