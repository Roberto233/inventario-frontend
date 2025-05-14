import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  productos: any[] = [];
  stockBajo: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerStockBajo();
  }

  obtenerProductos() {
    this.http.get<any[]>('https://inventario-de-productos-con-control-de.onrender.com/api/productos').subscribe({
      next: (data) => {
        this.productos = data;
        // Ordenar productos por stock ascendente
        this.productos.sort((a, b) => a.stock - b.stock);
      },
      error: (err) => console.error('Error al obtener productos', err)
    });
  }

  obtenerStockBajo() {
    this.http.get<any>('https://inventario-de-productos-con-control-de.onrender.com/api/reportes/stock-bajo').subscribe({
      next: (res) => this.stockBajo = res.productos,
      error: (err) => console.error('Error al obtener reporte', err)
    });
  }
}