import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


declare const bootstrap: any;

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  nuevoProducto: any = {
    nombre: '',
    descripcion: '',
    precio: null,
    stock: 0,
    categoria: ''
  };
  productoSeleccionado: any = null;
  movimiento = { tipo: 'entrada', cantidad: null };

  filtro = {
    categoria: '',
    stock_bajo: false
  };

  busqueda: string = '';
  editando = false;
  idEditando: string | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  get productosFiltrados() {
    return this.productos
      .filter(p =>
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      )
      .filter(p =>
        !this.filtro.categoria || p.categoria?._id === this.filtro.categoria
      )
      .filter(p =>
        !this.filtro.stock_bajo || p.stock < 5
      );
  }

  obtenerProductos() {
    this.http.get<any[]>('https://inventario-de-productos-con-control-de.onrender.com/api/productos').subscribe({
      next: data => this.productos = data,
      error: err => this.toastr.error('Error al cargar productos')
    });
  }

  obtenerCategorias() {
    this.http.get<any[]>('https://inventario-de-productos-con-control-de.onrender.com/api/categorias').subscribe({
      next: data => this.categorias = data,
      error: err => this.toastr.error('Error al cargar categorías')
    });
  }

  crearProducto() {
    const duplicado = this.productos.some(p => p.nombre.toLowerCase() === this.nuevoProducto.nombre.toLowerCase());
    if (duplicado && !this.editando) {
      this.toastr.error('Ya existe un producto con ese nombre.');
      return;
    }

    if (this.nuevoProducto.stock < 0 || this.nuevoProducto.precio < 0) {
      this.toastr.error('Stock y precio no pueden ser negativos.');
      return;
    }

    const peticion = this.editando
      ? this.http.put(`https://inventario-de-productos-con-control-de.onrender.com/api/productos/${this.idEditando}`, this.nuevoProducto)
      : this.http.post(`https://inventario-de-productos-con-control-de.onrender.com/api/productos`, this.nuevoProducto);

    peticion.subscribe({
      next: () => {
        this.toastr.success(this.editando ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        this.obtenerProductos();
        this.resetFormulario();
      },
      error: err => this.toastr.error('Error al guardar producto')
    });
  }

  eliminarProducto(id: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el producto permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://inventario-de-productos-con-control-de.onrender.com/api/productos/${id}`).subscribe({
          next: () => {
            this.obtenerProductos();
            this.toastr.success('Producto eliminado correctamente');
          },
          error: (err) => {
            this.toastr.error('Error al eliminar el producto');
            console.error('Error al eliminar producto', err);
          }
        });
      }
    });
  }


  abrirModalEditar(producto: any) {
    this.editando = true;
    this.idEditando = producto._id;
    this.nuevoProducto = {
      ...producto,
      categoria: producto.categoria?._id || producto.categoria
    };
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
  }

  abrirModalCrear() {
    this.resetFormulario();
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
  }

  abrirModalMovimiento(producto: any) {
    this.productoSeleccionado = producto;
    this.movimiento = { tipo: 'entrada', cantidad: null };
    new bootstrap.Modal(document.getElementById('modalMovimiento')).show();
  }

  registrarMovimiento() {
    if (!this.movimiento.tipo || !this.movimiento.cantidad || this.movimiento.cantidad <= 0) {
      this.toastr.error('Por favor ingresa una cantidad válida.');
      return;
    }

    this.http.post(`https://inventario-de-productos-con-control-de.onrender.com/api/productos/${this.productoSeleccionado._id}/movimiento`, this.movimiento).subscribe({
      next: () => {
        this.toastr.success('Movimiento registrado');
        this.obtenerProductos();
        this.productoSeleccionado = null;
      },
      error: err => this.toastr.error('Error al registrar movimiento')
    });
  }

  filtrarProductos() {
    // Nada aquí porque el getter productosFiltrados ya hace el trabajo.
  }

  limpiarFiltros() {
    this.filtro = { categoria: '', stock_bajo: false };
    this.busqueda = '';
  }

  resetFormulario() {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: null,
      stock: 0,
      categoria: ''
    };
    this.editando = false;
    this.idEditando = null;
  }
}


