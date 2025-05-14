import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  movimientos: any[] = [];
  busqueda: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    interface HistorialItem {
      tipo: string;
      cantidad: number;
      fecha: string;
    }

    interface ProductoConHistorial {
      nombre: string;
      historial: HistorialItem[];
    }

    this.http.get<any[]>('https://inventario-de-productos-con-control-de.onrender.com/api/productos').subscribe(productos => {
      this.movimientos = productos.flatMap((p: any) =>
        p.historial.map((h: any) => ({
          nombre: p.nombre,
          tipo: h.tipo,
          cantidad: h.cantidad,
          fecha: h.fecha
        }))
      );
    });
  }


  get movimientosFiltrados() {
    return this.movimientos.filter(m =>
      m.nombre?.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
}