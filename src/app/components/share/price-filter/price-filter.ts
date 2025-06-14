import { Component, inject, input } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-price-filter',
  imports: [MatSliderModule],
  templateUrl: './price-filter.html',
  styleUrl: './price-filter.scss'
})
export class PriceFilter {
  minPrice = input.required<number>();
  maxPrice = input.required<number>();
  mainservice = inject(MainService);

  private debounceTimeout: any;

  onSliderChange(start: string, end: string) {
    const startValue = Number(start);
    const endValue = Number(end);
    console.log('Price range changed:', startValue, endValue);
        clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.mainservice.filters.update(current => ({
        ...current,
        price: [startValue, endValue]
      }));
    }, 400); // 400ms delay, adjust as needed
  }
}