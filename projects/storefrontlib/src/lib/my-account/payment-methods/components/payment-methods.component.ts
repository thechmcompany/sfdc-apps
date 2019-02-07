import { Component, OnInit, OnDestroy } from '@angular/core';

import { PaymentDetails } from '@spartacus/core';
import { UserService } from '@spartacus/core';

import { Observable, Subscription } from 'rxjs';

import { Card } from '../../../ui/components/card/card.component';

@Component({
  selector: 'cx-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  paymentMethods$: Observable<PaymentDetails[]>;
  editCard: string;
  loading$: Observable<boolean>;
  userId: string;

  userServiceSub: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.paymentMethods$ = this.userService.getPaymentMethods();
    this.editCard = null;
    this.loading$ = this.userService.getPaymentMethodsLoading();
    this.userServiceSub = this.userService.get().subscribe(data => {
      this.userId = data.uid;
      this.userService.loadPaymentMethods(this.userId);
    });
  }

  getCardContent({
    defaultPayment,
    accountHolderName,
    expiryMonth,
    expiryYear,
    cardNumber
  }: PaymentDetails): Card {
    const actions: { name: string; event: string }[] = [];
    if (!defaultPayment) {
      actions.push({ name: 'Set as default', event: 'default' });
    }
    actions.push({ name: 'Delete', event: 'edit' });
    const card: Card = {
      header: defaultPayment ? 'DEFAULT' : null,
      textBold: accountHolderName,
      text: [cardNumber, `Expires: ${expiryMonth}/${expiryYear}`],
      actions,
      deleteMsg: 'Are you sure you want to delete this payment method?'
    };

    return card;
  }

  deletePaymentMethod(paymentMethod: PaymentDetails): void {
    if (this.userId) {
      this.userService.deletePaymentMethod(this.userId, paymentMethod.id);
    }
    this.editCard = null;
  }

  setEdit(paymentMethod: PaymentDetails): void {
    this.editCard = paymentMethod.id;
  }

  cancelCard(): void {
    this.editCard = null;
  }

  setDefaultPaymentMethod(paymentMethod: PaymentDetails): void {
    if (this.userId) {
      this.userService.setPaymentMethodAsDefault(this.userId, paymentMethod.id);
    }
  }

  ngOnDestroy() {
    if (this.userServiceSub) {
      this.userServiceSub.unsubscribe();
    }
  }
}
