import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import {
  ProductSearchService,
  ProductSearchPage,
  SearchConfig
} from '@spartacus/core';

@Component({
  selector: 'cx-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnChanges, OnInit {
  @Input()
  gridMode: String;
  @Input()
  query;
  @Input()
  categoryCode;
  @Input()
  brandCode;
  @Input()
  itemPerPage: number;

  grid: any;
  model$: Observable<ProductSearchPage>;
  searchConfig: SearchConfig = {};
  categoryTitle: string;
  options: SearchConfig;

  constructor(
    protected productSearchService: ProductSearchService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const { queryParams } = this.activatedRoute.snapshot;
    this.options = this.createOptionsByUrlParams();

    if (this.categoryCode && this.categoryCode !== queryParams.categoryCode) {
      this.query = ':relevance:category:' + this.categoryCode;
    }
    if (this.brandCode && this.brandCode !== queryParams.brandCode) {
      this.query = ':relevance:brand:' + this.brandCode;
    }
    if (!this.query && queryParams.query) {
      this.query = queryParams.query;
    }

    // do search only when 'brandCode' or 'categoryCode' or 'query' changed
    if (Object.keys(changes).length === 1 && !changes['gridMode']) {
      this.search(this.query, this.options);
    }
  }

  createOptionsByUrlParams(): SearchConfig {
    const { queryParams } = this.activatedRoute.snapshot;
    const newConfig = {
      ...queryParams
    };
    delete newConfig.query;
    const options = {
      ...this.searchConfig,
      ...newConfig,
      pageSize: this.itemPerPage || 10
    };
    if (this.categoryCode) {
      options.categoryCode = this.categoryCode;
    }
    if (this.brandCode) {
      options.brandCode = this.brandCode;
    }

    return options;
  }

  ngOnInit() {
    this.grid = {
      mode: this.gridMode
    };

    // clean previous search result
    this.productSearchService.clearSearchResults();

    this.model$ = this.productSearchService.getSearchResults().pipe(
      tap(searchResult => {
        if (Object.keys(searchResult).length === 0) {
          this.search(this.query, this.options);
        } else {
          this.getCategoryTitle(searchResult);
        }
      }),
      filter(searchResult => Object.keys(searchResult).length > 0)
    );
  }

  protected getCategoryTitle(data: ProductSearchPage): string {
    if (data.breadcrumbs && data.breadcrumbs.length > 0) {
      this.categoryTitle = data.breadcrumbs[0].facetValueName;
    } else if (!this.query.includes(':relevance:')) {
      this.categoryTitle = this.query;
    }
    if (this.categoryTitle) {
      this.categoryTitle =
        data.pagination.totalResults + ' results for ' + this.categoryTitle;
    }

    return this.categoryTitle;
  }

  onFilter(query: string) {
    this.query = query;
    this.search(query);
  }

  viewPage(pageNumber: number) {
    this.search(this.query, { currentPage: pageNumber });
  }

  sortList(sortCode: string) {
    this.search(this.query, { sortCode: sortCode });
  }

  protected search(query: string, options?: SearchConfig) {
    if (this.query) {
      if (options) {
        // Overide default options
        this.searchConfig = {
          ...this.searchConfig,
          ...options
        };
      }

      this.productSearchService.search(query, this.searchConfig);
    }
  }
}
