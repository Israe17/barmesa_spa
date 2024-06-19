import { Component } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { product } from '../../../../models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/categoria.service';
import { categoria } from '../../../../models/categoria';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';
import { server } from '../../../../services/global';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { pedidoProducto } from '../../../../models/pedidoproducto';
import { PedidoProdService }from '../../../../services/pedidoproducto.service';
import { PedidoService } from '../../../../services/pedido.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-add-orders',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './add-orders.component.html',
  styleUrl: './add-orders.component.css'
})
export class AddOrdersComponent implements OnInit{

  public product: product;
  public category: categoria;
  private status: number;
  public productLists: product[];
  public fileSelected: any;
  public previsualizacion: string = "";
  public imageUrl: any = "";
  public peticionDirectaImgUrl: string = server.url + "producto/getimage/";
  public categoryLists: categoria[] = [];
  public pedidoProd: pedidoProducto;


  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _PedidoProService: PedidoProdService,
    private _PedidoService: PedidoService,
    private router: Router


  ) {
    this.product = new product(1, "", "", 1, "", 1);
    this.pedidoProd = new pedidoProducto(1, 1, 1,"");
    this.category = new categoria(1, "");
    this.status = -1;
    this.productLists = [];
    this.filteredProduct = this.productLists;


  }

  ngOnInit(): void {
    initFlowbite();
    this.getProducts();
    this.visibleData();
    this.pageNumbers();
    this.getCategories();
    // debugger;
  }



  isDeleteModalOpen: boolean = false;
  openDeleteModal(){
    this.isDeleteModalOpen = true;
  }
  closeDeleteModal(){
    this.isDeleteModalOpen = false;
  }


  isActionDrowdownOpen: boolean = false;
  toggleDropdowns2() {
    this.isActionDrowdownOpen = this.isActionDrowdownOpen ? false : true;
  }

  deleteOrder(){
    let pedidoStor=localStorage.getItem('pedido');
    if(pedidoStor){
      let pedido:any = JSON.parse(pedidoStor);
      let idPedido = pedido.id;
      this._PedidoService.delete(idPedido).subscribe({
        next: (response: any) => {
          console.log(response);
          this.clearOdresFromStorage();
          this.clearOrderFromStorage();
          this.closeDeleteModal();
          Swal.fire({
            icon: 'success',
            title: 'Pedido eliminado correctamente',
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            this.router.navigate(['/dashboard/tables']);
          });
        },
        error: (error: any) => {
          console.error("Error al eliminar el pedido", error);
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar el pedido',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }

  filterByCategory(id: number) {
    if (id == 0) {
      this.filteredProduct = this.productLists;
    } else {
      this.filteredProduct = this.productLists.filter((product) => product.idCategoria == id);
    }
    this.currentPage = 1;
  }

  issDropdownOpen: boolean = false;

  toggleDropdowns() {
    this.issDropdownOpen = this.issDropdownOpen ? false : true;
  }

  getCategoryOfProduct(id: number): string {
    let category = this.categoryLists.find((category) => category.id == id);
    return category ? category.nombre : "No asignada";
  }


  getCategories() {
    this._CategoryService.getCategorias().subscribe({
      next: (response: any) => {
        console.log(response);
        this.categoryLists = response.data;
      },
      error: (error: any) => {
        console.error("Error al obtener las categorías", error);
      }
    });
  }

  getProducts() {
    this._ProductService.getProducts().subscribe({
      next: (response: any) => {
        console.log(response);
        this.productLists = response.data;
        // Asegúrate de que estás accediendo a 'data' en la respuesta
        this.filteredProduct = this.productLists;
        this.visibleData();
      },
      error: (error: any) => {
        console.error("Error al obtener los Productos", error);
      }
    });
  };

  changeStatus(st: number) {
    this.status = st;
    let countdown = timer(3000);
    countdown.subscribe(() => {
      this.status = -1;
    });
  }

  isDropdownOpen: boolean[] = [];

  toggleDropdown(index: number) {
    this.isDropdownOpen[index] = !this.isDropdownOpen[index];
  }

  currentPage: number = 1;
  pageSize: number = 10;
  filteredProduct: Array<product> = [];

  visibleData() {
    let start = (this.currentPage - 1) * this.pageSize;
    let end = start + this.pageSize;
    return this.filteredProduct.slice(start, end);
  }

  nextPage() {
    this.currentPage++;
    this.visibleData();
  }

  previousPage() {
    this.currentPage--;
    this.visibleData();
  }

  pageNumbers() {
    let totalPage = Math.ceil(this.productLists.length / this.pageSize);
    let pageNumArray = new Array(totalPage);
    return pageNumArray;

  }
  filterData(searchTerm: string) {
    this.filteredProduct = this.productLists.filter((item) => {
      return Object.values(item).some((value) => {
        return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

  }
  goToPage(page: number) {
    this.currentPage = page;
    this.visibleData();
  }

  // Método para obtener la imagen asociada a un usuario
  getProductImage(filename: string) {
    this._ProductService.getImage(filename).subscribe({
      next: (imageBlob: Blob) => {
        // Crear una URL local para la imagen Blob y devolverla
        const imageUrl = URL.createObjectURL(imageBlob);
        this.previsualizacion = imageUrl;
      },
      error: (error: any) => {
        console.error("Error al obtener la imagen", error);
      }
    });
  }

  addOrderFromStorage(order: product) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

  }
  getOrdersFromStorage() {

    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
  NumOrders() {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.length;
  }

  deleteOrderFromStorageById(id: number) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    let index = orders.findIndex((order: product) => order.id == id);
    if (index != -1) {
      orders.splice(index, 1);
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }

  clearOdresFromStorage() {
    localStorage.removeItem('orders');
  }
  clearOrderFromStorage() {
    localStorage.removeItem('pedido');
  }



  submitOrder() {
    let pedidoStor=localStorage.getItem('pedido');
    if(pedidoStor){
      let pedido:any = JSON.parse(pedidoStor);
      let idPedido = pedido.id;

      let products:[]=this.getOrdersFromStorage();
      products.forEach((product:product) => {
        this.pedidoProd.idPedido=idPedido;
        this.pedidoProd.idProducto=product.id;

        this._PedidoProService.store(this.pedidoProd).subscribe({
          next: (response: any) => {
            console.log(response);
          },
          error: (error: any) => {
            console.error("Error al guardar el pedido", error);
          }
        });


      });
    }
  }
}
