import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LinkComponent } from './link.component';
import { ConfigModule, UrlTranslationModule } from '@spartacus/core';
import { CmsConfig } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CMSLinkComponent: { selector: 'cx-link' }
      }
    }),
    UrlTranslationModule
  ],
  declarations: [LinkComponent],
  exports: [LinkComponent],
  entryComponents: [LinkComponent]
})
export class LinkModule {}
