import { throwError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { OccConfig } from '../../occ/config/occ-config';
import { LanguageList, CurrencyList } from '../../occ/occ-models/occ.models';

@Injectable({
  providedIn: 'root'
})
export class OccSiteService {
  constructor(private http: HttpClient, private config: OccConfig) {}

  protected getBaseEndPoint(): string {
    if (!this.config || !this.config.server) {
      return '';
    }
    return (
      (this.config.server.baseUrl || '') +
      this.config.server.occPrefix +
      this.config.site.baseSite
    );
  }

  loadLanguages(): Observable<LanguageList> {
    return this.http
      .get(this.getBaseEndPoint() + '/languages')
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  loadCurrencies(): Observable<CurrencyList> {
    return this.http
      .get(this.getBaseEndPoint() + '/currencies')
      .pipe(catchError((error: any) => throwError(error.json())));
  }
}
