import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import { NutzerListeComponent } from './nutzer-liste/nutzer-liste.component';
import { TransaktionListeComponent } from './transaktion-liste/transaktion-liste.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NutzerListeComponent, TransaktionListeComponent, HttpClientModule, CommonModule, FormsModule]
})
export class AppComponent {
  title = 'ngc-frontend';
  
}



