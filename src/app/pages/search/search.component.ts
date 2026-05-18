import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { BurgersService } from '../../services/burgers/burgers.service';
import { BeveragesService } from '../../services/beverages/beverages.service';
import { SweetsService } from '../../services/sweets/sweets.service';

interface SearchItem {
    id: number;
    title: string;
    category: string;
    price: string;
    image: string;
}

@Component({
    selector: 'app-search',
    imports: [CommonModule, FormsModule, NavBarComponent, SideBarComponent],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
    query = '';
    allItems: SearchItem[] = [];
    filteredItems: SearchItem[] = [];

    constructor(
        private burgerService: BurgersService,
        private beverageService: BeveragesService,
        private sweetsService: SweetsService
    ) { }

    ngOnInit(): void {
        forkJoin({
            burgers: this.burgerService.getAll(),
            beverages: this.beverageService.getAll(),
            sweets: this.sweetsService.getAll()
        }).subscribe(({ burgers, beverages, sweets }) => {
            this.allItems = [
                ...burgers.map((item) => ({ ...item, category: 'Burger' })),
                ...beverages.map((item) => ({ ...item, category: 'Beverage' })),
                ...sweets.map((item) => ({ ...item, category: 'Sweet' }))
            ];
            this.filteredItems = [...this.allItems];
        });
    }

    onSearch(): void {
        const value = this.query.trim().toLowerCase();

        if (!value) {
            this.filteredItems = [...this.allItems];
            return;
        }

        this.filteredItems = this.allItems.filter(
            (item) => item.title.toLowerCase().includes(value) || item.category.toLowerCase().includes(value)
        );
    }
}
