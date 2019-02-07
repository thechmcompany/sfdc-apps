import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CmsModule } from '../cms/cms.module';

import { StoreFinderSearchComponent } from './components/store-finder-search/store-finder-search.component';
// tslint:disable-next-line:max-line-length
import { StoreFinderListComponent } from './components/store-finder-search-result/store-finder-list/store-finder-list.component';
import { StoreFinderMapComponent } from './components/store-finder-map/store-finder-map.component';
import { StoreFinderListItemComponent } from './components/store-finder-list-item/store-finder-list-item.component';
import { StoreFinderStoreDescriptionComponent } from './components/store-finder-store-description/store-finder-store-description.component';
import { ScheduleComponent } from './components/schedule-component/schedule.component';
import { StoreFinderStoresCountComponent } from './components/store-finder-stores-count/store-finder-stores-count.component';
import { StoreFinderGridComponent } from './components/store-finder-grid/store-finder-grid.component';
import { StoreFinderHeaderComponent } from './components/store-finder-header/store-finder-header.component';
import { StoreFinderSearchResultComponent } from './components/store-finder-search-result/store-finder-search-result.component';

import { PaginationAndSortingModule } from '../ui/components/pagination-and-sorting/pagination-and-sorting.module';
import { BootstrapModule } from '../bootstrap.module';
import { SpinnerModule } from '../ui/components/spinner/spinner.module';
import { StoreFinderCoreModule, UrlTranslationModule } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    CmsModule,
    ReactiveFormsModule,
    RouterModule,
    PaginationAndSortingModule,
    BootstrapModule,
    SpinnerModule,
    UrlTranslationModule,
    StoreFinderCoreModule
  ],
  declarations: [
    StoreFinderSearchComponent,
    StoreFinderListComponent,
    StoreFinderMapComponent,
    StoreFinderListItemComponent,
    StoreFinderStoresCountComponent,
    StoreFinderGridComponent,
    StoreFinderStoreDescriptionComponent,
    ScheduleComponent,
    StoreFinderHeaderComponent,
    StoreFinderSearchResultComponent
  ],
  exports: [
    StoreFinderSearchComponent,
    StoreFinderListComponent,
    StoreFinderMapComponent,
    StoreFinderListItemComponent,
    StoreFinderStoresCountComponent,
    StoreFinderGridComponent,
    StoreFinderStoreDescriptionComponent,
    ScheduleComponent,
    StoreFinderHeaderComponent,
    StoreFinderSearchResultComponent
  ]
})
export class StoreFinderModule {}
