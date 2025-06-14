import { Routes } from '@angular/router';
import { Main } from './components/main';
import { AboutUs } from './components/about-us/about-us';
import { Register } from './components/register/register';

export const routes: Routes = [  
    { path: '', component: Main },
    { path: 'about-us', component: AboutUs },
    { path: 'register', component: Register },
    { path: '**', redirectTo: '' },
];
