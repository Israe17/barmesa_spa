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

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css'
})
export class TablesComponent {


  public product: product;
  public category: categoria;
  private status: number;
  public productLists: product[];
  public fileSelected: any;
  public previsualizacion: string = "";
  public imageUrl: any = "";
  public peticionDirectaImgUrl: string = server.url + "producto/getimage/";
  public categoryLists: categoria[] = [];

  constructor(
    private _ProductService: ProductService,
    private _CategoryService: CategoryService,

  ) {
    this.product = new product(1, "", "", 1, "", 1);
    this.category = new categoria(1, "");
    this.status = -1;
    this.productLists = [];
    this.filteredProduct = this.productLists;

  }

  ngOnInit(): void {
    this.getProducts();
    this.visibleData();
    this.pageNumbers();
    this.getCategories();
    // debugger;
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

  isTableOpen: boolean = true;
  isCardsOpen: boolean = false;

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

}




