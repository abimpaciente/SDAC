import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-session-bar',
  imports: [RouterLink],
  templateUrl: './session-bar.html',
  styleUrl: './session-bar.scss',
})
export class SessionBar {
  protected readonly auth = inject(AuthService);

  protected cerrarSesion(): void {
    void this.auth.cerrarSesion();
  }
}
