import { TestBed, inject } from '@angular/core/testing';
import { SearchBoxComponentService } from './search-box-component.service';
import { of, Observable } from 'rxjs';
import { CmsComponentData } from '../../cms/components/cms-component-data';
import {
  ProductSearchService,
  ProductSearchPage,
  Suggestion,
  Component as SpaComponent
} from '@spartacus/core';
import { RoutingService } from '@spartacus/core';
import createSpy = jasmine.createSpy;

const mockQueryString = '?query=mockQuery';

class MockProductSearchService {
  searchAuxiliary = createSpy().and.returnValue(of([]));
  getSuggestions = createSpy().and.returnValue(of({}));

  getSearchSuggestions(): Observable<Suggestion[]> {
    return of();
  }
  getAuxSearchResults(): Observable<ProductSearchPage> {
    return of();
  }
}

const mockRouterState = {
  state: {
    params: {
      query: 'test'
    }
  }
};

const routingServiceMock = {
  go: createSpy('go'),
  getRouterState() {
    return of(mockRouterState);
  }
};
const componentDataMock = <CmsComponentData<SpaComponent>>{
  data$: of({})
};

describe('SearchBoxComponentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CmsComponentData,
          useValue: componentDataMock
        },
        {
          provide: RoutingService,
          useValue: routingServiceMock
        },
        {
          provide: ProductSearchService,
          useClass: MockProductSearchService
        },
        SearchBoxComponentService
      ]
    });
  });

  it('should be created', inject(
    [SearchBoxComponentService],
    (service: SearchBoxComponentService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should navigate at launchSearchPage(query: string)', inject(
    [SearchBoxComponentService],
    (service: SearchBoxComponentService) => {
      spyOn(service, 'launchSearchPage').and.callThrough();

      service.launchSearchPage(mockQueryString);
      expect(service.launchSearchPage).toHaveBeenCalled();
      expect(routingServiceMock.go).toHaveBeenCalledWith({
        route: [
          {
            name: 'search',
            params: { query: mockQueryString }
          }
        ]
      });
    }
  ));

  it('should get suggestions from search)', inject(
    [SearchBoxComponentService],
    (service: SearchBoxComponentService) => {
      const productSearchService = TestBed.get(ProductSearchService);

      const searchConfig = { pageSize: 5 };
      service.typeahead(of('testQuery')).subscribe(() => {
        expect(productSearchService.getSuggestions).toHaveBeenCalledWith(
          'testQuery',
          searchConfig
        );
      });
    }
  ));

  it('should expose query param', inject(
    [SearchBoxComponentService],
    (service: SearchBoxComponentService) => {
      let queryParam;
      service.queryParam$.subscribe(x => (queryParam = x));
      expect(queryParam).toEqual(mockRouterState.state.params.query);
    }
  ));
});
