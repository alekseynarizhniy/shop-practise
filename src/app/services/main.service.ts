import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

import { smartphone } from '../interfaces/smartphone.model';
import { ErrorService } from './error.service';

const MAIN_URL = 'https://shop-practise.onrender.com/';

interface Sort {
  order: 'lh' | 'hl' | 'az' | 'za';
  screen: string[];
  ram: string[];
  storage: string[];
  price: [number, number];
}

@Injectable({
  providedIn: 'root',
})
export class MainService {
  smartphones = signal<smartphone[]>([]);
  filters = signal<Sort>({
    order: 'lh',
    screen: [],
    ram: [],
    storage: [],
    price: [0, 100000],
  });
  userLoggedIn = signal<boolean>(false);
  curUser = signal<{ id: number; login: string; basket: number[] }>({
    id: 0,
    login: '',
    basket: [],
  });
  isFetching = signal<boolean>(false);

  private errorService = inject(ErrorService);
  private httpClient = inject(HttpClient);

  constructor() {
    this.loadSmartphones().subscribe({
      next: (data) => {
        console.log('Smartphones fetched successfully');
        this.smartphones.set(data);
      },
      error: () => {
        this.errorService.showError(
          'Something went wrong with fetching smartphones'
        );
      },
      complete: () => {
        this.isFetching.set(false);
        console.log('Smartphones fetching completed');
      },
    });

    const savedForm = window.localStorage.getItem('saved-login-form');

    if (savedForm) {
      const user = JSON.parse(savedForm).user;
      console.log('User found in local storage:', user);
      this.loginUser({ login: user.login, password: user.password })
        .then(() => {
          console.log('User logged in from local storage');
        })
        .catch(() => {
          console.log('Failed to log in user from local storage');
        });
    }
  }

  loadSmartphones() {
    this.isFetching.set(true);
    const url = MAIN_URL + 'smartphones';
    const errorMessage = 'Something went wrong with fetching smartphones';
    return this.fetchData(url, errorMessage);
  }

  private fetchData(url: string, errorMessage: string) {
    return this.httpClient.get<{ smartphones: smartphone[] }>(url).pipe(
      map((val) => val.smartphones),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  loginUser(credentials: {
    login: string;
    password: string;
  }): Promise<boolean> {
    const url = MAIN_URL + 'login';
    const errorMessage = 'Something went wrong with fetching user';

    return new Promise((resolve, reject) => {
      this.httpClient
        .post<
          | { success: boolean }
          | { success: { id: number; login: string; basket: number[] } }
        >(url, credentials)
        .pipe(
          map((val) => {
            console.log('Login successful', val.success);
            return val;
          }),
          catchError((error) => {
            console.log(error);
            reject(false);
            return throwError(() => new Error(errorMessage));
          })
        )
        .subscribe({
          next: (data) => {
            if (typeof data.success === 'object') {
              this.userLoggedIn.set(true);
              this.curUser.set(data.success);
              window.localStorage.setItem(
                'saved-login-form',
                JSON.stringify({ user: data.success })
              );
              console.log('Users fetched successfully', data);
              resolve(true);
            } else {
              this.userLoggedIn.set(false);
              reject(false);
            }
          },
          error: () => {
            this.userLoggedIn.set(false);
            reject(false);
          },
        });
    });
  }

  addUser(user: { login: string; password: string }) {
    const url = MAIN_URL + 'users';
    const errorMessage = 'Something went wrong with registering user';
    return new Promise((resolve, reject) => {
      this.httpClient
        .post<
          | { success: boolean }
          | {
              success: {
                id: number;
                login: string;
                password: string;
                basket: number[];
              };
            }
        >(url, user)
        .pipe(
          map((val) => {
            console.log('User registration successful', val.success);
            return val;
          }),
          catchError((error) => {
            console.log(error);
            reject(false);
            return throwError(() => new Error(errorMessage));
          })
        )
        .subscribe({
          next: (data) => {
            if (typeof data.success === 'object') {
              this.userLoggedIn.set(true);
              this.curUser.set(data.success);
              window.localStorage.setItem(
                'saved-login-form',
                JSON.stringify({ user: data.success })
              );
              resolve(true);
            } else {
              this.userLoggedIn.set(false);
              reject(false);
            }
          },
          error: () => {
            reject(false);
          },
        });
    });
  }

  logout() {
    window.localStorage.removeItem('saved-login-form');
    this.userLoggedIn.set(false);
    this.curUser.set({ id: 0, login: '', basket: [] });
  }

  sortedSmartphones = computed(() => {
    let newSmartphones = [...this.smartphones()];
    const filter = this.filters();

    switch (filter.order) {
      case 'lh':
        newSmartphones.sort((a, b) => a.price - b.price);
        break;
      case 'hl':
        newSmartphones.sort((a, b) => b.price - a.price);
        break;
      case 'az':
        newSmartphones.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        newSmartphones.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    if (filter.screen.length > 0) {
      newSmartphones = newSmartphones.filter((s) =>
        filter.screen.includes(s.specs.screen)
      );
    }
    if (filter.ram.length > 0) {
      newSmartphones = newSmartphones.filter((s) =>
        filter.ram.includes(s.specs.ram)
      );
    }
    if (filter.storage.length > 0) {
      newSmartphones = newSmartphones.filter((s) =>
        filter.storage.includes(s.specs.storage)
      );
    }

    newSmartphones = newSmartphones.filter(
      (s) => s.price >= filter.price[0] && s.price <= filter.price[1]
    );

    return newSmartphones;
  });

  addToBasket(smartphoneId: number): void {
    if (!this.curUser().basket.includes(smartphoneId)) {
      const userId = this.curUser().id;
      const url = MAIN_URL + 'basket';
      const errorMessage =
        'Something went wrong with adding smartphone to basket';

      this.httpClient
        .post<{ success: boolean }>(url, { userId, smartphoneId })
        .pipe(
          map((val) => {
            console.log('Smartphone add response:', val.success);
            return val;
          }),
          catchError((error) => {
            console.log(error);
            return throwError(() => new Error(errorMessage));
          })
        )
        .subscribe({
          next: (data) => {
            if (data.success) {
              const updatedBasket = [...this.curUser().basket, smartphoneId];
              const curUser = this.curUser();
              this.curUser.set({
                ...curUser,
                basket: updatedBasket,
              });

              window.localStorage.setItem(
                'saved-login-form',
                JSON.stringify({ user: { ...curUser, basket: updatedBasket } })
              );
              console.log('Smartphone added to basket successfully');
            } else {
              console.error('Failed to add smartphone to basket');
            }
          },
          error: () => {
            console.error('Error occurred while adding smartphone to basket');
          },
        });
    }
  }

  removeFromBasket(smartphoneIds: number | number[]): void {
    const userId = this.curUser().id;
    const url = MAIN_URL + 'basket';
    const errorMessage =
      'Something went wrong with removing smartphone from basket';

    // Ensure smartphoneIds is always an array
    const idsToRemove = Array.isArray(smartphoneIds)
      ? smartphoneIds
      : [smartphoneIds];

    this.httpClient
      .delete<{ success: boolean }>(url, {
        body: { userId, smartphoneIds: idsToRemove },
      })
      .pipe(
        map((val) => {
          console.log('Smartphone remove response:', val.success);
          return val;
        }),
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error(errorMessage));
        })
      )
      .subscribe({
        next: (data) => {
          if (data.success) {
            const curUser = this.curUser();
            const updatedBasket = curUser.basket.filter(
              (id) => !idsToRemove.includes(id)
            );
            this.curUser.set({
              ...curUser,
              basket: updatedBasket,
            });
            window.localStorage.setItem(
              'saved-login-form',
              JSON.stringify({ user: { ...curUser, basket: updatedBasket } })
            );
            console.log('Smartphone(s) removed from basket successfully');
          } else {
            console.error('Failed to remove smartphone(s) from basket');
          }
        },
        error: () => {
          console.error(
            'Error occurred while removing smartphone(s) from basket'
          );
        },
      });
  }

  getCountOfBasket(): number {
    return this.curUser().basket.length;
  }
}
