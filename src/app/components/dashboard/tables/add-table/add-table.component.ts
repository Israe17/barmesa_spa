import { Component } from '@angular/core';
import { MesaService } from '../../../../services/mesa.service';
import { Mesa } from '../../../../models/mesa';
import Swal from 'sweetalert2';
import { timer } from 'rxjs';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../../services/pedido.service';
import { Pedido } from '../../../../models/pedido';

@Component({
  selector: 'app-add-table',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './add-table.component.html',
  styleUrl: './add-table.component.css'
})
export class AddTableComponent implements OnInit{

  public Mesa: Mesa;
  public pedido: Pedido;

  public tableLists: Mesa[];
  private status: number;

  constructor(

    private _MesaService: MesaService,
    private _PedidoService: PedidoService

  ) {

    this.Mesa = new Mesa(1,"", 2);
    this.pedido = new Pedido(1, 1,"","","");
    this.tableLists = [];
    this.status = -1;

  }


  ngOnInit(): void {
    initFlowbite();

    this.getTables();
  }




  isDropdownOpen: boolean[] = [];

  toggleDropdown(index: number) {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }

  changeStatus(st: number) {
    this.status = st;
    let countdown = timer(3000);
    countdown.subscribe(() => {
      this.status = -1;
    });
  }



  getTables() {
    this._MesaService.getMesas().subscribe({
      next: (response: any) => {
        console.log(response);
        this.tableLists = response.data;
      },
      error: (error: any) => {
        console.error("Error al obtener las mesas", error);
      }
    });
  }

  onSubmitTable(form: any){

    this.Mesa.estado = "Disponible";
    console.log(this.Mesa);
    this._MesaService.store(this.Mesa).subscribe({
      next: (response: any) => {
        console.log(response);
        form.reset();
        this.changeStatus(1);
        Swal.fire({
          icon: 'success',
          title: 'Mesa guardada',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          location.reload();
        });
      },
      error: (error: any) => {
        console.error("Error al guardar la mesa", error);
        this.changeStatus(0);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar la mesa',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });

  }

  addPedido(idTable: number) {
    const now = new Date();
    const fecha = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const hora = now.toTimeString().split(' ')[0]; // HH:MM:SS format

    this.pedido.idMesa = idTable;
    this.pedido.fecha = fecha;
    this.pedido.hora = hora;
    this.pedido.estado = "Enespera";



    console.log(this.pedido);
    this._PedidoService.store(this.pedido).subscribe({
      next: (response: any) => {
        console.log(response);
        this.pedido = response.pedido;
        this.saveToLocalStorage(this.pedido);
        this.changeStatus(1);
        Swal.fire({
          icon: 'success',
          title: 'Generado pedido exitosamente',
          showConfirmButton: false,
          timer: 999
        }).then(() => {
          location.reload();
        });
      },
      error: (error: any) => {
        console.error("Error al guardar el pedido", error);
        this.changeStatus(0);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar el pedido',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  saveToLocalStorage(pedido: any) {
    localStorage.setItem('pedido', JSON.stringify(pedido));
  }






}
