import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CmsComponentData } from './../../cms/components/cms-component-data';
import { CmsBreadcrumbsComponent } from '@spartacus/core';

@Component({
  selector: 'cx-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent {
  constructor(public component: CmsComponentData<CmsBreadcrumbsComponent>) {}
}
