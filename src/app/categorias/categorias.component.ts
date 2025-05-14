import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  nuevaCategoria: any = { nombre: '' };
  editando = false;
  idEditando: string | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.http.get<any[]>('https://inventario-de-productos-con-control-de.onrender.com/api/categorias').subscribe({
      next: (data) => this.categorias = data,
      error: () => this.toastr.error('Error al obtener categorías')
    });
  }

  guardarCategoria() {
    const nombre = this.nuevaCategoria.nombre.trim();

    if (!nombre) {
      this.toastr.warning('El nombre de la categoría es obligatorio.');
      return;
    }

    const existe = this.categorias.some(
      cat => cat.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (existe && !this.editando) {
      this.toastr.error('Ya existe una categoría con ese nombre.');
      return;
    }

    if (this.editando && this.idEditando) {
      // EDITAR
      this.http.put(`https://inventario-de-productos-con-control-de.onrender.com/api/categorias/${this.idEditando}`, { nombre }).subscribe({
        next: () => {
          this.obtenerCategorias();
          this.resetFormulario();
          this.toastr.success('Categoría editada exitosamente');
        },
        error: () => this.toastr.error('Error al editar la categoría')
      });
    } else {
      // CREAR
      this.http.post('https://inventario-de-productos-con-control-de.onrender.com/api/categorias', { nombre }).subscribe({
        next: () => {
          this.obtenerCategorias();
          this.resetFormulario();
          this.toastr.success('Categoría agregada exitosamente');
        },
        error: () => this.toastr.error('Error al agregar la categoría')
      });
    }
  }

  editarCategoria(categoria: any) {
    this.editando = true;
    this.idEditando = categoria._id;
    this.nuevaCategoria = { nombre: categoria.nombre };
  }

  eliminarCategoria(id: string) {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://inventario-de-productos-con-control-de.onrender.com/api/categorias/${id}`).subscribe({
          next: () => {
            this.obtenerCategorias();
            this.toastr.success('Categoría eliminada exitosamente');
          },
          error: () => this.toastr.error('Error al eliminar la categoría')
        });
      }
    });
  }

  resetFormulario() {
    this.nuevaCategoria = { nombre: '' };
    this.editando = false;
    this.idEditando = null;
  }
}
