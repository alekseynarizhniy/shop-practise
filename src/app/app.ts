import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Breadcrumbs } from "./components/breadcrumbs/breadcrumbs";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Breadcrumbs],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}



