import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-custom',
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './custom.html',
  styleUrl: './custom.scss'
})
export class Custom {

  loading = false;
  success = false;
  errorMessage = '';

  selectedFiles: File[] = [];

  formData = {
    name: '',
    email: '',
    phone: '',
    type: '',
    description: '',
    size: '',
    budget: '',
    deadline: ''
  };

  projectTypes = [
    'Impresión 3D',
    'Modelado 3D',
    'Prototipo',
    'Prop de Cosplay',
    'Miniatura',
    'Figura',
    'Pieza de reemplazo',
    'Otro'
  ];

  constructor(private http: HttpClient) { }

  onFilesSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    const files = Array.from(input.files);

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    for (const file of files) {

      // TIPO
      if (!allowedTypes.includes(file.type)) {

        this.errorMessage =
          `"${file.name}" no es una imagen válida.`;

        return;
      }

      // TAMAÑO
      if (file.size > 5 * 1024 * 1024) {

        this.errorMessage =
          `"${file.name}" supera los 5MB.`;

        return;
      }
    }

    this.errorMessage = '';

    this.selectedFiles = files;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  submitForm(): void {
    this.loading = true;
    this.success = false;
    this.errorMessage = '';

    const formData = new FormData();

    Object.entries(this.formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.http.post(
      'https://api.reimii.com/api/custom-requests',
      formData
    ).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;

        this.formData = {
          name: '',
          email: '',
          phone: '',
          type: '',
          description: '',
          size: '',
          budget: '',
          deadline: ''
        };

        this.selectedFiles = [];
      },
      error: err => {

        console.error('CUSTOM REQUEST ERROR:', err);

        // VALIDACIONES BACKEND
        if (err.status === 400) {

          // express-validator
          if (err.error?.errors?.length) {

            this.errorMessage = err.error.errors
              .map((e: any) => e.msg)
              .join(', ');

          } else {

            this.errorMessage =
              err.error?.message ||
              'Datos inválidos.';
          }
        }

        // IMAGEN DEMASIADO GRANDE
        else if (err.status === 413) {

          this.errorMessage =
            'Las imágenes son demasiado grandes.';

        }

        // ERROR SERVIDOR
        else if (err.status === 500) {

          this.errorMessage =
            'Error interno del servidor.';

        }

        // SIN CONEXIÓN
        else if (err.status === 0) {

          this.errorMessage =
            'No se puede conectar con el servidor.';

        }

        // FALLBACK
        else {

          this.errorMessage =
            err.error?.message ||
            'Ha ocurrido un error inesperado.';
        }

        this.loading = false;
      }
    });
  }
}