import { Injectable } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import * as fromStore from '../store/index';
import { Product } from '../../occ/occ-models/occ.models';

@Injectable()
export class ProductService {
  constructor(private store: Store<fromStore.StateWithProduct>) {}

  /**
   * Returns the product observable. The product will be loaded
   * whenever there's no value observed.
   *
   * The underlying product loader ensures that the product is
   * only loaded once, even in case of parallel observers.
   */
  get(productCode: string, forceReload = false): Observable<Product> {
    return this.store.pipe(
      select(fromStore.getSelectedProductStateFactory(productCode)),
      tap(productState => {
        const attemptedLoad =
          productState.loading || productState.success || productState.error;

        if (!attemptedLoad || forceReload) {
          this.store.dispatch(new fromStore.LoadProduct(productCode));
        }
      }),
      map(productState => productState.value)
    );
  }

  /**
   * Returns boolean observable for product's loading state
   */
  isLoading(productCode: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getSelectedProductLoadingFactory(productCode))
    );
  }

  /**
   * Returns boolean observable for product's load success state
   */
  isSuccess(productCode: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getSelectedProductSuccessFactory(productCode))
    );
  }

  /**
   * Returns boolean observable for product's load error state
   */
  hasError(productCode: string): Observable<boolean> {
    return this.store.pipe(
      select(fromStore.getSelectedProductErrorFactory(productCode))
    );
  }

  /**
   * Reloads the product. The product is loaded implicetly
   * whenever selected by the `get`, but in some cases an
   * explicit reload might be needed.
   */
  reload(productCode: string) {
    this.store.dispatch(new fromStore.LoadProduct(productCode));
  }
}
