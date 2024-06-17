import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { product } from '../../../models/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../services/categoria.service';
import { categoria } from '../../../models/categoria';
import { timer } from 'rxjs';
import Swal from 'sweetalert2';
import { server } from '../../../services/global';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Mesa } from '../../../models/mesa';
import { MesaService } from '../../../services/mesa.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent implements OnInit {


  public product: product;
  public category: categoria;
  public Mesa: Mesa;
  private status: number;
  public productLists: product[];
  public tableLists: Mesa[];
  public fileSelected: any;
  public previsualizacion: string = "";
  public imageUrl: any = "";
  public peticionDirectaImgUrl: string = server.url + "producto/getimage/";
  public categoryLists: categoria[] = [];

  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,
    private _MesaService: MesaService

  ) {
    this.product = new product(1, "", "", 1, "", 1);
    this.category = new categoria(1, "");
    this.Mesa = new Mesa(1,"", 1);
    this.tableLists = [];
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
    this.getTables();
    // debugger;
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


  isTableOpen: boolean = true;
  isCardsOpen: boolean = false ;

  toggleTable() {
    this.isTableOpen = true;
    this.isCardsOpen = false;
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


  toggleCards() {
    this.isTableOpen = false;
    this.isCardsOpen = true;
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

  createDivSalas(index: number) {
    for (let i = 0; i < index; i++) {
        let div = document.createElement('div');
        div.setAttribute('class', 'container');
        div.setAttribute('id', `divSalas${i}`); // Asigna un id único a cada div
        document.body.appendChild(div);

        let h1 = document.createElement('h1');
        h1.setAttribute('class', 'text-center');
        h1.innerText = `Sala ${i + 1}`; // Etiqueta cada sala con un número único
        div.appendChild(h1);

        let divRow = document.createElement('div');
        divRow.setAttribute('class', 'row');
        div.appendChild(divRow);

        let divCol = document.createElement('div');
        divCol.setAttribute('class', 'col-12');
        divRow.appendChild(divCol);

        let divCard = document.createElement('div');
        divCard.setAttribute('class', 'card');
        divCol.appendChild(divCard);

        let divCardBody = document.createElement('div');
        divCardBody.setAttribute('class', 'card-body');
        divCard.appendChild(divCardBody);

        let h5 = document.createElement('h5');
        h5.setAttribute('class', 'card-title');
        h5.innerText = `Sala ${i + 1}`; // Etiqueta cada sala con un número único
        divCardBody.appendChild(h5);

        let p = document.createElement('p');
        p.setAttribute('class', 'card-text');
        p.innerText = 'Salas de la casa';
        divCardBody.appendChild(p);

        let a = document.createElement('a');
        a.setAttribute('class', 'btn btn-primary');
        a.setAttribute('href', '#');
        a.innerText = 'Go somewhere';
        divCardBody.appendChild(a);
    }
}


}



