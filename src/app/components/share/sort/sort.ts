import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-sort',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './sort.html',
  styleUrl: './sort.scss'
})
export class Sort {
  mainService = inject(MainService);

  onSortChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'lh' | 'hl' | 'az' | 'za';
    this.mainService.filters.update(current => ({
      ...current,
      order: value
    }));
  }
}
