import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [NgIf, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  name = '';
  username = '';
  email = '';
  password = '';

  selectedImage?: File;

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedImage = input.files[0];
  }

  register(): void {
    this.loading = true;
    this.errorMessage = '';

    const data = new FormData();

    data.append('name', this.name);
    data.append('username', this.username);
    data.append('email', this.email);
    data.append('password', this.password);

    if (this.selectedImage) {
      data.append('profileImage', this.selectedImage);
    }

    this.authService.register(data).subscribe({
      next: res => {
        this.authService.saveSession(res);
        this.router.navigate(['/profile']);
      },

      error: err => {
        this.errorMessage =
          err.error?.message ||
          'No se pudo crear la cuenta';

        this.loading = false;
      }
    });
  }
}