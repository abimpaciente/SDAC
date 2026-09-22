import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { mensajeErrorAuth } from '../../../core/auth/auth-errores';

type Modo = 'login' | 'registro';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly modo = signal<Modo>('login');
  protected readonly enviando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nombre: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected cambiarModo(modo: Modo): void {
    this.modo.set(modo);
    this.error.set(null);
  }

  protected async enviar(): Promise<void> {
    if (this.form.invalid || (this.modo() === 'registro' && !this.form.value.nombre?.trim())) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, email, password } = this.form.getRawValue();
    this.enviando.set(true);
    this.error.set(null);

    try {
      if (this.modo() === 'registro') {
        await this.auth.registrar(nombre.trim(), email, password);
      } else {
        await this.auth.iniciarSesion(email, password);
      }
      const volver = this.route.snapshot.queryParamMap.get('volver') ?? '/inicio';
      await this.router.navigateByUrl(volver);
    } catch (error) {
      this.error.set(mensajeErrorAuth(error));
    } finally {
      this.enviando.set(false);
    }
  }
}
