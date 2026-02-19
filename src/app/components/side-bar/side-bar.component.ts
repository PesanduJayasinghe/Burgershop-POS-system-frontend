import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule,RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit{

  constructor(private router: Router){}

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.navigateTo('burgers');
    }
  }

   navigateTo(category: string): void {
    this.router.navigate([category]);
  }

}
