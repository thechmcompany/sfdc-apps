import { TestBed, inject } from '@angular/core/testing';
import { StoreModule, Store, combineReducers } from '@ngrx/store';
import { StoresState } from '../store/store-finder-state';

import * as fromStore from '../store';

import { StoreFinderService } from './store-finder.service';
import { LongitudeLatitude } from '../model/longitude-latitude';
import { WindowRef } from '../../window/window-ref';

describe('StoreFinderService', () => {
  let service: StoreFinderService;
  let store: Store<StoresState>;
  let winRef: WindowRef;

  const queryText = 'test';
  const countryIsoCode = 'CA';
  const regionIsoCode = 'CA-QC';
  const storeId = 'shop_los_angeles_1';
  const geolocationWatchId = 1;

  const longitudeLatitude: LongitudeLatitude = {
    longitude: 10.1,
    latitude: 20.2
  };

  const MockWindowRef = {
    nativeWindow: {
      navigator: {
        geolocation: {
          watchPosition: callback => {
            callback({ coords: longitudeLatitude });
            return geolocationWatchId;
          },
          clearWatch: () => {}
        }
      }
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          store: combineReducers(fromStore.getReducers)
        })
      ],
      providers: [
        StoreFinderService,
        { provide: WindowRef, useValue: MockWindowRef }
      ]
    });

    service = TestBed.get(StoreFinderService);
    store = TestBed.get(Store);
    winRef = TestBed.get(WindowRef);

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(
      winRef.nativeWindow.navigator.geolocation,
      'watchPosition'
    ).and.callThrough();
    spyOn(
      winRef.nativeWindow.navigator.geolocation,
      'clearWatch'
    ).and.callThrough();
  });

  it('should inject StoreFinderService', inject(
    [StoreFinderService],
    (storeFinderService: StoreFinderService) => {
      expect(storeFinderService).toBeTruthy();
    }
  ));

  describe('Find Stores', () => {
    it('should dispatch a new action', () => {
      service.findStores(queryText, false);

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.FindStores({ queryText: queryText })
      );
    });
  });

  describe('Find Stores with My Location', () => {
    it('should dispatch a OnHold action and a FindStores action', () => {
      service.findStores(queryText, true);

      expect(store.dispatch).toHaveBeenCalledWith(new fromStore.OnHold());
      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.FindStores({
          queryText,
          longitudeLatitude
        })
      );
      expect(
        winRef.nativeWindow.navigator.geolocation.watchPosition
      ).toHaveBeenCalled();
    });
  });

  describe('Find Stores Twice with My Location', () => {
    it('should clear watch geolocation', () => {
      service.findStores(queryText, true);
      service.findStores(queryText, false);
      expect(
        winRef.nativeWindow.navigator.geolocation.watchPosition
      ).toHaveBeenCalled();
      expect(
        winRef.nativeWindow.navigator.geolocation.clearWatch
      ).toHaveBeenCalledWith(geolocationWatchId);
    });
  });

  describe('View Store By Id', () => {
    it('should dispatch a new FindStoreById action', () => {
      service.viewStoreById(storeId);

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.FindStoreById({ storeId })
      );
    });
  });

  describe('View All Stores', () => {
    it('should dispatch a new action', () => {
      service.viewAllStores();

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.ViewAllStores()
      );
    });
  });

  describe('View All Stores for Country', () => {
    it('should dispatch a new action', () => {
      service.viewAllStoresForCountry(countryIsoCode);

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.FindAllStoresByCountry({ countryIsoCode })
      );
    });
  });

  describe('View All Stores for Region', () => {
    it('should dispatch a new action', () => {
      service.viewAllStoresForRegion('CA', 'CA-QC');

      expect(store.dispatch).toHaveBeenCalledWith(
        new fromStore.FindAllStoresByRegion({ countryIsoCode, regionIsoCode })
      );
    });
  });
});
