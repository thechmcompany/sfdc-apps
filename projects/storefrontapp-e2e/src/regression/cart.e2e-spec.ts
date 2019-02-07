import { CartPage } from '../page-objects/cart/cart.po';
import { HomePage } from '../page-objects/home.po';
import { LoginHelper } from '../page-objects/login/login.helper';
import { SearchResultsPage } from '../page-objects/search-results.po';
import { ProductDetailsPage } from '../page-objects/product-details.po';
import { E2EUtil } from '../e2e-util';
import { AddedToCartModal } from '../page-objects/cmslib/added-to-cart-modal.po';
import { AutocompletePanel } from '../page-objects/cmslib/autocomplete-panel.po';

describe('Cart interactions', () => {
  let home: HomePage;
  let searchResults: SearchResultsPage;
  let cart: CartPage;
  let productDetails: ProductDetailsPage;
  let atcModal: AddedToCartModal;
  const USER_FULL_NAME = `${LoginHelper.DEFAULT_FIRST_NAME} ${
    LoginHelper.DEFAULT_LAST_NAME
  }`;
  const PRODUCT_CODE_1 = '1934793';
  const PRODUCT_CODE_2 = '300938';
  const PRODUCT_CODE_3 = '3470545';
  const PRODUCT_CODE_4 = '29925';
  const PRODUCT_TYPE = 'camera';

  beforeAll(async () => {
    home = new HomePage();
    searchResults = new SearchResultsPage();
    cart = new CartPage();
    productDetails = new ProductDetailsPage();
    atcModal = new AddedToCartModal();
  });

  /**
   * Full interaction. Search 2 products, add to cart, then verify totals in cart.
   */
  it('should add products to cart via search autocomplete', async () => {
    await home.navigateTo();
    await home.header.performSearch(PRODUCT_CODE_1, true);

    const autocompletePanel = new AutocompletePanel();
    await autocompletePanel.waitForReady();

    // select product from the suggestion list, then add it to cart 2 times
    await autocompletePanel.selectProduct('PowerShot A480');

    // wait until product details page is loaded
    await productDetails.waitForReady();
    await productDetails.addToCart();
    await atcModal.waitForReady();
    await atcModal.closeButton.click();

    const minicartIcon = home.header.miniCartButton;
    await E2EUtil.wait4VisibleElement(minicartIcon);
    expect(await home.header.miniCartButton.getText()).toContain('1');

    await minicartIcon.click();

    // wait for cart page to show up
    await cart.waitForReady();

    expect(await cart.checkCartEntry('PowerShot A480', 1, '$99.85', '$99.85'));
  });

  it('should add products to cart through search result page', async () => {
    // search for camera
    await home.header.performSearch(PRODUCT_TYPE);

    // wait for search results page to show up
    await searchResults.waitForReady();

    // select one product by name and add it to the cart
    const product1 = await searchResults.productByNameInResults(
      'Photosmart E317 Digital Camera'
    );

    expect(await product1.isDisplayed()).toBeTruthy();
    await searchResults.clickAddToCartButton4Product(product1);
    await atcModal.waitForReady();
    const item = await atcModal.item;
    await E2EUtil.wait4VisibleElement(item);

    await atcModal.closeButton.click();

    const minicartIcon = await home.header.miniCartButton;
    await E2EUtil.wait4VisibleElement(minicartIcon);
    expect(await home.header.miniCartButton.getText()).toContain('2');

    await minicartIcon.click();

    // wait for cart page to show up
    await cart.waitForReady();

    // check that the cart has 2 items now
    expect(
      await E2EUtil.wait4TextInElement(cart.page, 'Cart total (2 items):')
    );

    // check if cart contains quantity 1 of 'Photosmart E317 Digital Camera'
    expect(
      await cart.checkCartEntry(
        'Photosmart E317 Digital Camera',
        1,
        '$114.12',
        '$114.12'
      )
    );
  });

  it('should display empty cart if no items added and when items are removed', async () => {
    // delete all items from cart
    await cart.deleteEntryByName('PowerShot A480');

    // check that the cart has 1 item now
    await E2EUtil.wait4TextInElement(cart.page, 'Cart total (1 items):');
    expect(
      await cart.checkCartEntry(
        'Photosmart E317 Digital Camera',
        1,
        '$114.12',
        '$114.12'
      )
    );

    await cart.deleteEntryByName('Photosmart E317 Digital Camera');
    await E2EUtil.wait4TextInElement(cart.page, 'Your shopping cart is empty');

    const cartPageText = await cart.page.getText();
    expect(cartPageText).toContain('Your shopping cart is empty');
    expect(cartPageText).toContain('Suggestions');
    expect(cartPageText).toContain(
      'Browse our products by selecting a category above'
    );
  });

  it('should add product to cart as anonymous and merge when logged in', async () => {
    await home.navigateTo();
    await home.waitForReady();
    // Let's register
    const { email, password } = await LoginHelper.registerNewUser();
    expect(await home.header.isLoggedIn()).toBeTruthy();
    expect(await home.header.loginComponent.getText()).toContain(
      USER_FULL_NAME
    );

    // Add product to cart
    await home.header.performSearch(PRODUCT_CODE_2, true);
    const autocompletePanel = new AutocompletePanel();
    await autocompletePanel.waitForReady();
    await autocompletePanel.selectProduct('Photosmart E317 Digital Camera');
    // wait until product details page is loaded
    await productDetails.waitForReady();
    await productDetails.addToCart();

    await atcModal.waitForReady();
    const item = await atcModal.item;
    await E2EUtil.wait4VisibleElement(item);

    // check item has been added to cart
    expect(await atcModal.itemQuantity.getAttribute('value')).toEqual('1');
    expect(await atcModal.totalCount.getText()).toContain('1 items');
    expect(await home.header.miniCartButton.getText()).toContain('1');
    await atcModal.closeButton.click();

    // Log out.
    await LoginHelper.logOutViaHeader();

    // Check that we are not logged in
    expect(await home.header.isLoggedIn()).toBeFalsy();

    // select product from the suggestion list, then add it to cart 2 times
    await home.header.performSearch(PRODUCT_CODE_3, true);
    await autocompletePanel.selectProduct('EASYSHARE M381');
    // wait until product details page is loaded
    await productDetails.waitForReady();
    await productDetails.addToCart();

    await atcModal.waitForReady();

    // check item has been added to cart
    expect(await atcModal.itemQuantity.getAttribute('value')).toEqual('1');

    expect(await atcModal.totalCount.getText()).toContain('1 items');
    expect(await home.header.miniCartButton.getText()).toContain('1');

    await atcModal.closeButton.click();

    await LoginHelper.loginUserViaHeader(email, password);
    // Go to cart
    const minicartIcon = home.header.miniCartButton;
    await E2EUtil.wait4VisibleElement(minicartIcon);
    expect(await home.header.miniCartButton.getText()).toContain('2');
    await minicartIcon.click();
    await cart.waitForReady();

    // Check if cart contains correct products
    expect(
      await E2EUtil.wait4TextInElement(cart.page, 'Cart total (2 items):')
    );
    expect(
      await cart.checkCartEntry(
        'Photosmart E317 Digital Camera',
        1,
        '$114.12',
        '$114.12'
      )
    );
    expect(
      await cart.checkCartEntry('EASYSHARE M381', 1, '$370.72', '$370.72')
    );
    await LoginHelper.logOutViaHeader();
  });

  it('should add product to cart and manipulate qty', async () => {
    await productDetails.navigateTo(PRODUCT_CODE_2);
    await productDetails.addToCartButton.click();
    await atcModal.waitForReady();
    const item = await atcModal.item;
    await E2EUtil.wait4VisibleElement(item);

    // check item has been added to cart
    expect(await atcModal.itemQuantity.getAttribute('value')).toEqual('1');

    expect(await atcModal.totalCount.getText()).toContain('1 items');

    await atcModal.closeButton.click();

    const minicartIcon = home.header.miniCartButton;
    await E2EUtil.wait4VisibleElement(minicartIcon);
    expect(await home.header.miniCartButton.getText()).toContain('1');
    await minicartIcon.click();

    // wait for cart page to show up
    await cart.waitForReady();

    // check cart contains correct item
    expect(
      await E2EUtil.wait4TextInElement(cart.page, 'Cart total (1 items):')
    );
    expect(
      await cart.checkCartEntry(
        'Photosmart E317 Digital Camera',
        1,
        '$114.12',
        '$114.12'
      )
    );

    // Change cart qty
    await cart.increaseQuantity();

    // check qty has changed
    expect(await E2EUtil.wait4TextInElement(cart.orderSummaryAmount, '208.24'));
    expect(
      await E2EUtil.wait4TextInElement(cart.page, 'Cart total (2 items):')
    );
    expect(
      await cart.checkCartEntry(
        'Photosmart E317 Digital Camera',
        2,
        '$114.12',
        '$228.24'
      )
    );

    await cart.increaseQuantity();

    // check qty has changed
    expect(await E2EUtil.wait4TextInElement(cart.orderSummaryAmount, '322.36'));
    expect(
      await E2EUtil.wait4TextInElement(cart.page, 'Cart total (3 items):')
    );
    expect(
      await cart.checkCartEntry(
        'Photosmart E317 Digital Camera',
        3,
        '$114.12',
        '$342.36'
      )
    );
  });

  it('should be unable to add out of stock products to cart', async () => {
    await productDetails.navigateTo(PRODUCT_CODE_4);
    // wait until product details page is loaded
    await E2EUtil.wait4VisibleElement(productDetails.page);

    // there should be no add to cart button, and should be an 'Out of stock' message instead
    expect(await productDetails.addToCartComponent.isPresent()).toBeFalsy();
    expect(await productDetails.outOfStockDiv.isDisplayed()).toBeTruthy();
  });
});
