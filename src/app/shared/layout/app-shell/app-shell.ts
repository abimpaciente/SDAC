import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BottomNav } from '../../components/bottom-nav/bottom-nav';
import { SessionBar } from '../../components/session-bar/session-bar';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, BottomNav, SessionBar],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {}
