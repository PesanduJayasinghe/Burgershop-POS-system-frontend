import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimeComponent } from "./components/time/time.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TimeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'burger';
}
