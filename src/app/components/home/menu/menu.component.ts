import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from '../../dashboard/products/products.component';
import { product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { server } from '../../../services/global';
import { categoria } from '../../../models/categoria';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, CommonModule, ProductsComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  public fileSelected: any;
  public productLists: product[];
  public product: product;
  public imageUrl: any = "";
  public previsualizacion: string = "";
  public category: categoria;
  public categoryLists: categoria[] = [];


  public peticionDirectaImgUrl: string = server.url + "producto/getimage/";




  constructor(private productService: ProductService) {

    this.product = new product(0, '', '', 0, '',0);
    this.category = new categoria(1, "");
    this.productLists = [];
    this.filteredProduct = this.productLists;
  }

  ngOnInit(): void {
    this.getProducts();
    this.visibleData();
  }
  currentPage: number = 1;
  pageSize: number = 10;
  filteredProduct: Array<product> = [];


  getProducts() {
    this.productService.getProducts().subscribe({
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
  visibleData() {
    let start = (this.currentPage - 1) * this.pageSize;
    let end = start + this.pageSize;
    return this.filteredProduct.slice(start, end);
  }
  filterData(searchTerm: string) {
    this.filteredProduct = this.productLists.filter((item) => {
      return Object.values(item).some((value) => {
        return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });

  }
  getProductImage(filename: string) {
    this.productService.getImage(filename).subscribe({
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

  getCategoryOfProduct(id: number): string {
    let category = this.categoryLists.find((category) => category.id == id);
    return category ? category.nombre : "No asignada";
  }


}

