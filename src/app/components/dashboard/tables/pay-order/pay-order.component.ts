import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { server } from '../../../../services/global';
import { OnInit } from '@angular/core';
import { format } from 'date-fns';
import { Cliente } from '../../../../models/cliente';
import { ClienteService } from '../../../../services/cliente.service';
import { Observable, of, pipe } from 'rxjs';
import { PedidoService } from '../../../../services/pedido.service';
import { PedidoProdService } from '../../../../services/pedidoproducto.service';
import { pedidoProducto } from '../../../../models/pedidoproducto';
import { map, catchError, find } from 'rxjs/operators';


@Component({
  selector: 'app-pay-order',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule],
  templateUrl: './pay-order.component.html',
  styleUrl: './pay-order.component.css'
})
export class PayOrderComponent implements OnInit {

  public peticionDirectaImgUrl: string = server.url + "producto/getimage/";
  fechaHoraActual: string;
  private intervalId: any;
  public cliente: Cliente;
  private clientes: Cliente[];
  clientesCargados: boolean = false;





  constructor(
    private _PedidoService: PedidoService,
    private _PedidoProService: PedidoProdService,

    private _ClienteService: ClienteService
  ) {
    this.fechaHoraActual = this.getFormattedDate(new Date());
    this.cliente = new Cliente(1, 1, "", "", "", "", "");
    this.clientes = [];
    this.clienteExistente = this.clientes;
    this.clienteEcontrado = new Cliente(1, 1, "", "", "", "", "");


  }



  clienteExistente: Array<Cliente> = [];
  clienteEcontrado: Cliente;



  // filterData(searchTerm: string) {
  //   this.filteredCliente = this.clientes.filter((item) => {
  //     return Object.values(item).some((value) => {
  //       return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
  //     });
  //   });
  // }


  // filterByCeldula(cedula: number) {
  //   if (cedula == 0) {
  //     this.filteredCliente = this.clientes;
  //   } else {
  //     this.filteredCliente = this.clientes.filter((cliente) => cliente.cedula == cedula);
  //     return ;
  //   }
  // }


  ngOnInit(): void {
    this.getOrdersFromStorage();
    this.getClientes();
    this.getOrders();
    this.NumOrders();


    this.intervalId = setInterval(() => {
      this.fechaHoraActual = this.getFormattedDate(new Date());
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Limpia el intervalo cuando el componente se destruya
    }
  }

  private getFormattedDate(date: Date): string {
    return format(date, 'PPpp'); // Formato de fecha y hora legible
  }


  getOrdersFromStorage() {

    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
  NumOrders() {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.length;
  }

  getOrders() {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders;
  }

  getClientes() {
    this._ClienteService.getClientes().subscribe({
      next: (res: any) => {
        console.log(res);
        this.clientes = res['data'];
        console.log(this.clientes);


        this.clientesCargados = true;
      },
      error: (err) => {
        console.error("No se pued erecurara los clientes", err);
        console.error(err);
      }
    });

  }

  // onSubmit(form: any) {
  //   console.log(form);
  //   let orders = this.getOrdersFromStorage();
  //   let total = orders.reduce((acc: number, order: any) => acc + order.precio * order.cantidad, 0);
  //   this.clienteReturn(form).subscribe({
  //     next: (cliente: Cliente | undefined) => {
  //       if (cliente) {
  //         let pedido = {
  //           idCliente: cliente.id,
  //           fecha: this.fechaHoraActual,
  //           total: total,
  //           estado: "Pendiente"
  //         };

  //         console.log(pedido);

  //         this.guardarPedido(pedido, orders);
  //       } else {
  //         console.error("No se encontró el cliente con la cédula especificada.");
  //       }
  //     },
  //     error: (err: any) => {
  //       console.error("Error al obtener el cliente", err);
  //     }
  //   });
  // }

  clienteSubmit(createForm: NgForm) {
  const cedulaCliente = this.cliente.cedula;
  console.log(cedulaCliente);
  this._ClienteService.getClientes().subscribe({
    next: (res) => {
      this.clientes = res['data'];
      console.log(this.clientes);
      const clienteExistente = this.clientes.find((cliente: Cliente) => cliente.cedula === cedulaCliente);
      console.log(clienteExistente);

      if (clienteExistente) {
        // Si el cliente existe, almacénalo en el localStorage y resetea el formulario
        localStorage.setItem('cliente', JSON.stringify(clienteExistente));
        createForm.reset();
      } else {
        // Si el cliente no existe, créalo y almacénalo en el localStorage
        this._ClienteService.store(this.cliente).subscribe({
          next: (res: any) => {
            console.log(res);
            localStorage.setItem('cliente', JSON.stringify(res));
            createForm.reset();
          },
          error: (err: any) => {
            console.error("Error al guardar el cliente", err);
          }
        });
      }
    },
    error: (err) => {
      console.error('Error al obtener los clientes', err);
    }
  });
}


  guardarPedido(pedido: any, orders: any[]) {
    this._PedidoService.store(pedido).subscribe({
      next: (res: any) => {
        console.log(res);
        let idPedido = res.id;
        orders.forEach((order: any) => {
          let pedidoProd: pedidoProducto = {
            id: 1, // Por ejemplo, si `id` es un campo requerido en `pedidoProducto`
            idPedido: idPedido,
            idProducto: order.id,
            descripcion: "Descripción del pedido" // Por ejemplo, si `descripcion` es un campo requerido en `pedidoProducto`
          };
          this._PedidoProService.store(pedidoProd).subscribe({
            next: (res: any) => {
              console.log(res);
            },
            error: (err: any) => {
              console.error("Error al guardar el pedido", err);
            }
          });
        });
        this.clearOdresFromStorage();
        this.clearOrderFromStorage();
      },
      error: (err: any) => {
        console.error("Error al guardar el pedido", err);
      }
    });
  }


  clearOdresFromStorage() {
    localStorage.removeItem('orders');
  }
  clearOrderFromStorage() {
    localStorage.removeItem('pedido');
  }


}








