import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductReferencesComponent } from './product-references.component';
// import { MediaModule } from '../../ui/components/media/media.module';
import { ProductCarouselModule } from '../product-carousel/product-carousel.module';
import { ConfigModule } from '@spartacus/core';
import { CmsConfig } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // MediaModule,
    ProductCarouselModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        ProductReferencesComponent: { selector: 'cx-product-references' }
      }
    })
  ],
  declarations: [ProductReferencesComponent],
  entryComponents: [ProductReferencesComponent],
  exports: [ProductReferencesComponent]
})
export class ProductReferencesModule {}
