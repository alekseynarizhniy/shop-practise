import { Component, effect, inject } from '@angular/core';
import { CardList } from './card-list/card-list';
import { Sort } from './share/sort/sort';
import { Filter } from './share/filter/filter';
import { PriceFilter } from './share/price-filter/price-filter';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-main',
  imports: [CardList, Sort, Filter, PriceFilter],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  mainService = inject(MainService);
  isFetching = this.mainService.isFetching;
  smartphones = this.mainService.smartphones;

  minPrice = 0;
  maxPrice = 0;
  screenFilter: string[] = [];
  ramFilter: string[] = [];
  storageFilter: string[] = [];

  constructor() {
    effect(() => {
      const phones = this.smartphones();
      if (phones.length) {
        this.minPrice = Math.floor(Math.min(...phones.map(s => s.price)));
        this.maxPrice = Math.ceil(Math.max(...phones.map(s => s.price)));
        this.screenFilter = Array.from(new Set(phones.map(s => s.specs.screen)));
        this.ramFilter = Array.from(new Set(phones.map(s => s.specs.ram)));
        this.storageFilter = Array.from(new Set(phones.map(s => s.specs.storage)));
      }
    });
  }
}
