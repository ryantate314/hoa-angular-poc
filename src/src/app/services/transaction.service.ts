import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  public getTransactions(plotId: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${environment.apiUrl}/transactions`,
      {
        params: {
          plotId: plotId
        }
      }
    ).pipe(
      map(transactions => transactions.map(transaction => ({
        ...transaction,
        // Parse the string JSON date into a JavaScript date object
        date: new Date(transaction.date)
      })))
    );
  }

  public createTransaction(plotId: string, transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${environment.apiUrl}/transactions`,
      transaction,
      {
        params: {
          plotId: plotId
        }
      }
    );
  }
}
