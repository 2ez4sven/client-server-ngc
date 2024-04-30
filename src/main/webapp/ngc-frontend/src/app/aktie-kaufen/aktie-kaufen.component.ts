import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, forkJoin, map } from 'rxjs';
import { TransaktionListeComponent } from '../transaktion-liste/transaktion-liste.component';
import { AuthService } from '../AuthService';

@Component({
  selector: 'app-aktie-kaufen',
  standalone: true,
  templateUrl: './aktie-kaufen.component.html',
  styleUrl: './aktie-kaufen.component.css',
  imports: [CommonModule, FormsModule]
})
export class AktieKaufenComponent {
  // Deklariere ein Ereignis
  @Output() transactionCompleted = new EventEmitter<void>();
  depotID: number = 0;
  isLoading = false;
  initalLoading = true;
  isin: string = '';
  anzahl: number = 0;
  errorMessage: string = '';
  successMessage: string = '';
  formSubmitted: boolean = false;
  stockSaved: boolean = false;
  currentPrice: number = 0;
  private apiKey: string = "co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g";
  private apiUrl: string = "https://finnhub.io/api/v1/search";
  symbols: any[] = [];


  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit() {
    this.initalLoading = true;
    this.loadDepotID(() => {
      this.errorMessage = '';
      this.successMessage = '';
      this.stockSaved = false;
      this.currentPrice = 0;
    });
  }

  loadDepotID(callback: () => void){
    const token = this.authService.getToken();
    if(token !== null && token !== '') {
      forkJoin([
        this.authService.getDepotIDFromToken(token)
      ]).subscribe(([depotID]) => {
        if (depotID !== 0 && depotID !== null) {
          this.depotID = depotID;
        }
        callback();
      });
    }
  };

  getCurrentPrice(symbol: string): Observable<number> {
    const url: string = `${this.apiUrl}${symbol}&token=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(response => response.c)
    );
  }

  searchSymbols(inputValue: string) {
    this.isLoading = true;
    this.initalLoading = false;
    const query = inputValue.trim();
    if (query !== '') {
      const url: string = `${this.apiUrl}?q=${query}&token=${this.apiKey}`;
      this.http.get<any>(url).subscribe(response => {
        if (response && response.result) {
          this.symbols = response.result.filter((symbol: { symbol: string; }) => /^[A-Za-z]+$/.test(symbol.symbol));
          this.isLoading = false;
          this.initalLoading = false;
        } else {
          this.symbols = [];
        }
      });
    } else {
      this.symbols = [];
    }
  }
  
  
  

  setSelectedSymbol(symbol: string) {
    this.isin = symbol;
    this.symbols = []; // Um die Dropdown-Liste zu schließen, nachdem ein Symbol ausgewählt wurde
}

  kaufen() {
    this.errorMessage = '';
    const url = `http://localhost:8080/depot/kaufen?isin=${this.isin}&anzahl=${this.anzahl}&depotID=${this.depotID}`;

    this.http.post(url, {}, {responseType: 'text'}).subscribe(response => {
      console.log(response);
      if (response === 'Aktie erfolgreich gekauft!') {
        this.successMessage = response;
        this.stockSaved = true;
        this.isin = '';
        this.anzahl = 0;
      } else {
        this.errorMessage = response;
      }
    });
  }
}
