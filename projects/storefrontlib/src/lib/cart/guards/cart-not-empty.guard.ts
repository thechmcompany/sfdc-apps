import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';
import { skipWhile, map, switchMap } from 'rxjs/operators';

import { CartService, RoutingService } from '@spartacus/core';

@Injectable()
export class CartNotEmptyGuard implements CanActivate {
  constructor(
    private cartService: CartService,
    private routingService: RoutingService
  ) {}

  canActivate(): Observable<boolean> {
    return this.cartService.getLoaded().pipe(
      skipWhile(loaded => !loaded),
      switchMap(() => this.cartService.getActive()),
      map(cart => {
        if (this.cartService.isEmpty(cart)) {
          this.routingService.go({ route: ['home'] });
          return false;
        }
        return true;
      })
    );
  }
}
