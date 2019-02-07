import { TestBed } from '@angular/core/testing';
import { OccUserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  User,
  Address,
  AddressValidation,
  AddressList,
  PaymentDetails,
  PaymentDetailsList
} from '../../occ/occ-models/index';
import { OccConfig } from '../../occ/config/occ-config';

const username = 'mockUsername';
const password = '1234';

const user: User = {
  customerId: username,
  displayUid: password
};
const endpoint = '/users';
const addressVerificationEndpoint = '/addresses/verification';
const addressesEndpoint = '/addresses';
const paymentDetailsEndpoint = '/paymentdetails';

const MockOccModuleConfig: OccConfig = {
  server: {
    baseUrl: '',
    occPrefix: ''
  },

  site: {
    baseSite: ''
  }
};

describe('OccUserService', () => {
  let service: OccUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OccUserService,
        { provide: OccConfig, useValue: MockOccModuleConfig }
      ]
    });

    service = TestBed.get(OccUserService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load user details', () => {
    it('should load user details for given username abd access token', () => {
      service.loadUser(username).subscribe(result => {
        expect(result).toEqual(user);
      });

      const mockReq = httpMock.expectOne(req => {
        return req.method === 'GET' && req.url === endpoint + `/${username}`;
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(user);
    });
  });

  describe('load address verification results', () => {
    it('should load address verification results for given user id and address', () => {
      const address: Address = {
        companyName: 'ACME',
        defaultAddress: true
      };
      const suggestedAddresses: AddressValidation = {
        suggestedAddresses: [address]
      };

      service.verifyAddress(username, address).subscribe(result => {
        expect(result).toEqual(suggestedAddresses);
      });

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'POST' &&
          req.url === endpoint + `/${username}` + addressVerificationEndpoint
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(suggestedAddresses);
    });
  });

  describe('load user addresses', () => {
    it('should load user addresses for a given user id', () => {
      const mockAddress1: Address = {
        companyName: 'mockCompany1'
      };
      const mockAddress2: Address = {
        companyName: 'mockCompany2'
      };
      const mockUserAddresses: AddressList = {
        addresses: [mockAddress1, mockAddress2]
      };

      service.loadUserAddresses(username).subscribe(result => {
        expect(result).toEqual(mockUserAddresses);
      });

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.url === endpoint + `/${username}` + addressesEndpoint
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockUserAddresses);
    });
  });

  describe('load user payment methods', () => {
    it('should load user payment methods for a given user id', () => {
      const mockPayment1: PaymentDetails = {
        accountHolderName: 'mockAccountHolderName1'
      };
      const mockPayment2: PaymentDetails = {
        accountHolderName: 'mockAccountHolderName2'
      };
      const mockUserPaymentMethods: PaymentDetailsList = {
        payments: [mockPayment1, mockPayment2]
      };

      service.loadUserPaymentMethods(username).subscribe(result => {
        expect(result).toEqual(mockUserPaymentMethods);
      });

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.url ===
            `${endpoint}/${username}${paymentDetailsEndpoint}?saved=true`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockUserPaymentMethods);
    });
  });

  describe('set default user payment method', () => {
    it('should set default payment method for given user', () => {
      const mockPayment: PaymentDetails = {
        defaultPayment: true,
        id: '123'
      };

      service
        .setDefaultUserPaymentMethod(username, mockPayment.id)
        .subscribe(result => {
          expect(result).toEqual('');
        });

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'PATCH' &&
          req.body.defaultPayment === true &&
          req.url ===
            `${endpoint}/${username}${paymentDetailsEndpoint}/${mockPayment.id}`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush('');
    });
  });

  describe('delete user payment method', () => {
    it('should delete payment method for given user', () => {
      const mockPayment: PaymentDetails = {
        id: '123'
      };

      service
        .deleteUserPaymentMethod(username, mockPayment.id)
        .subscribe(result => expect(result).toEqual(''));

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'DELETE' &&
          req.url ===
            `${endpoint}/${username}${paymentDetailsEndpoint}/${mockPayment.id}`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush('');
    });
  });
});
