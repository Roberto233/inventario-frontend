import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'https://inventario-de-productos-con-control-de.onrender.com/api/productos'; ;

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
