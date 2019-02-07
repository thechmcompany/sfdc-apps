import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DebugElement,
  Input,
  Pipe,
  PipeTransform,
  Component
} from '@angular/core';
import { By } from '@angular/platform-browser';

import {
  CmsService,
  Component as SpaComponent,
  TranslateUrlOptions
} from '@spartacus/core';

import { NavigationService } from '../navigation/navigation.service';

import { NavigationComponent } from '..';
import { FooterNavigationComponent } from './footer-navigation.component';
import { of } from 'rxjs';
import { CmsComponentData } from '../../cms/components/cms-component-data';
import { NavigationNode } from '../navigation/navigation-node.model';

@Component({
  selector: 'cx-navigation-ui',
  template: ''
})
class MockNavigationUIComponent {
  @Input()
  dropdownMode = 'list';
  @Input()
  node: NavigationNode;
}

@Component({
  selector: 'cx-generic-link',
  template: '<ng-content></ng-content>'
})
class MockGenericLinkComponent {
  @Input()
  url: string | any[];
  @Input()
  target: string;
}

@Pipe({ name: 'cxTranslateUrl' })
class MockTranslateUrlPipe implements PipeTransform {
  transform(options: TranslateUrlOptions): string | string[] {
    return '/translated-path' + options.url;
  }
}

describe('FooterNavigationComponent', () => {
  let component: FooterNavigationComponent;
  let fixture: ComponentFixture<FooterNavigationComponent>;
  let footer: DebugElement;
  let column: DebugElement;

  const mockLinks: NavigationNode[] = [
    {
      title: 'Test child 1',
      url: '/test1',
      target: true
    },
    {
      title: 'Test child 2',
      url: '/',
      target: false
    }
  ];

  const mockCmsComponentData = <CmsComponentData<SpaComponent>>{
    data$: of()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        FooterNavigationComponent,
        NavigationComponent,
        MockNavigationUIComponent,
        MockGenericLinkComponent,
        MockTranslateUrlPipe
      ],
      providers: [
        NavigationService,
        { provide: CmsService, useValue: {} },
        { provide: NavigationService, useValue: {} },
        { provide: CmsComponentData, useValue: mockCmsComponentData }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterNavigationComponent);
    component = fixture.componentInstance;
    component.node$ = of({
      children: [
        {
          title: 'Test 1',
          url: '/',
          children: mockLinks
        }
      ]
    });

    fixture.detectChanges();
  });

  it('should create FooterNavigationComponent in CmsLib', () => {
    expect(component).toBeTruthy();
  });

  describe('UI tests', () => {
    beforeAll(() => {
      footer = fixture.debugElement;
      column = footer.query(By.css('.container'));
    });

    it('should display the column title', () => {
      const titleElement: HTMLElement = column.query(By.css('h1'))
        .nativeElement;

      expect(titleElement.textContent).toEqual('Test 1');
    });

    it('should display the correct number of links', () => {
      const list: HTMLElement = column.query(By.css('ul')).nativeElement;

      expect(list.childElementCount).toBe(2);
    });

    it('should display link title with correct url', () => {
      const link = column.query(By.css('cx-generic-link'));

      expect(link.nativeElement.innerHTML).toContain(mockLinks[0].title);
      expect(link.componentInstance.url).toEqual(
        '/translated-path' + mockLinks[0].url
      );
    });

    it('should have the correct target', () => {
      const links = column.queryAll(By.css('cx-generic-link'));

      expect(links[0].componentInstance.target).toEqual('blank');
      expect(links[1].componentInstance.target).toEqual('self');
    });
  });
});
