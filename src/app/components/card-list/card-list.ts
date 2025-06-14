import { Component, computed, effect, inject, Injectable, signal, viewChild, ViewChild } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';

import { MainService } from '../../services/main.service';

import { Card } from "./card/card";

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.html',
  styleUrl: './card-list.scss',
  imports: [MatGridListModule, Card, MatPaginatorModule],
})
export class CardList {
  pageIndex = signal<number>(0);
  pageSize = signal<number>(6);
  mainService = inject(MainService);

  smartphones = this.mainService.sortedSmartphones;

  paginator = viewChild(MatPaginator)

  constructor() {
    effect(() => {
      const total = this.smartphones().length;
      const pageSize = this.pageSize();
      const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
      if (this.pageIndex() > maxPage) {
        this.pageIndex.set(0);
        this.paginator()?.firstPage();
      }
    });
  }

  paggenedSmartphones = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = (this.pageIndex() + 1) * this.pageSize();
    const result = this.smartphones().slice(start, end);
    return result;
  });

  handlePageEvent($event: PageEvent) {
    this.pageIndex.set($event.pageIndex)
    this.pageSize.set($event.pageSize)
  } 
}
