import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BottomNav } from '../../components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, BottomNav],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {}
