import { Component, inject, input, signal } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-filter',
  imports: [ MatCheckboxModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {
  filters = input.required<string[]>();
  type = input.required<string>();
  mainService = inject(MainService);

  isOpen = signal(false);

  toggleSection() {
    this.isOpen.set(!this.isOpen());
  }

  onCheckboxChange(item: string, checked: boolean) {
    const value = item;

    if(checked) {
      this.mainService.filters.update(current => ({
        ...current,
        [this.type()]: [...(current[this.type() as keyof typeof current]), value]
      }));
    }else{
      this.mainService.filters.update(current => ({
        ...current,
        [this.type()]: (current[this.type() as keyof typeof current] as string[]).filter(i => i !== value)
      }));
    }

  }

}
