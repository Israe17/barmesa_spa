import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { product} from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  public product:product;
    private status:number;
    public productLists: product[];
    public fileSelected: any;
    public previsualizacion: string="";


    constructor(
        private _ProductService:ProductService,
        private _router:Router,

    ){
        this.product = new product(1,"","",1,"");
        this.status = -1;
        this.productLists= [];
        this.filteredProduct = this.productLists;

    }

    ngOnInit(): void{
        this.getProducts();
        this.visibleData();
        this.pageNumbers();
        // debugger;
    }

    isDeleteModalOpen: boolean = false;
    selectedUserId: number | null = null;

    openDeleteConfirmation(userId: number) {
      this.isDeleteModalOpen = true;
      this.selectedUserId = userId;
    }

    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.selectedUserId = null;
    }

    confirmDelete() {
      if (this.selectedUserId !== null) {

        this._ProductService.delete(this.selectedUserId).subscribe({
          next: (response: any) => {
            console.log(response);
            this.getProducts();
          },
          error: (error: any) => {
            console.error("Error al eliminar el producto", error);
          }
        });
      }
      this.closeDeleteModal();
    }

    isShowModalOpen:boolean = false;

    openShowModal(productId:number) {
      this.isShowModalOpen = true;
      this.selectedUserId = productId;
      this._ProductService.getProduct(productId).subscribe({
        next: (response: any) => {
          console.log(response);
           this.product = response.data;
        },
        error: (error: any) => {
          console.error("Error al obtener el producto", error);
        }
      })
    }

    closeShowModal() {
      this.isShowModalOpen = false;
      this.selectedUserId = null;
    }



    onSubmit(form: any) {
      if (this.fileSelected) {
        this._ProductService.uploadImage(this.fileSelected).subscribe({
          next: (response: any) => {
            if (response.filename) {
              this.product.image = response.filename;
              this._ProductService.store(this.product).subscribe({
                next: (responseSub: any) => {
                  form.reset();
                  this.changeStatus(0);
                  this.getProducts();
                },
                error: (error: any) => {
                  this.changeStatus(2);
                  console.error("Error al registrar el producto", error);
                }
              });
            } else {
              console.error("Falta el nombre del archivo en la respuesta");
            }
          },
          error: (error: any) => {
            console.error("Error al subir la producto", error);
          }
        });
      } else {
        this._ProductService.store(this.product).subscribe({
          next: (response: any) => {
            if (response.status == 201) {
              form.reset();
              this.changeStatus(0);
              this.getProducts();
            } else {
              this.changeStatus(1);
            }
          },
          error: (error: any) => {
            this.changeStatus(2);
            console.error("Error al registrar el producto", error);
          }
        });
      }
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

    changeStatus(st:number){
        this.status = st;
        let countdown =timer (3000);
        countdown.subscribe(()=>{
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

    visibleData(){
        let start = (this.currentPage-1)*this.pageSize;
        let end = start + this.pageSize;
        return this.filteredProduct.slice(start,end);
    }

    nextPage(){
        this.currentPage++;
        this.visibleData();
    }

    previousPage(){
        this.currentPage--;
        this.visibleData();
    }

    pageNumbers(){
      let totalPage = Math.ceil(this.productLists.length/this.pageSize);
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
    getUserImage(filename: string) {
        this._ProductService.getImage(filename).subscribe({
            next: (imageBlob: Blob) => {
                // Crear una URL local para la imagen Blob y devolverla
                const imageUrl = URL.createObjectURL(imageBlob);
                return imageUrl;
            },
            error: (error: any) => {
                console.error("Error al obtener la imagen", error);
            }
        });
    }


    captureFile(event:any){
      let file = event.target.files[0];
      this.fileSelected = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e:any)=>{
        this.previsualizacion = e.target.result;
      }
    }

    subirArchivo(event: any) {
      const file = event.target.files[0];
      if (file) {
        this._ProductService.uploadImage(file).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.filename) {
              this.product.image = response.filename;
              this._ProductService.store(this.product).subscribe({
                next: (responseSub: any) => {
                  console.log(responseSub);
                  this.getProducts();
                },
                error: (error: any) => {
                  console.error("Error al registrar el producto", error);
                }
              });
            } else {
              console.error("Falta el nombre del archivo en la respuesta");
            }
          },
          error: (error: any) => {
            console.error("Error al subir la imagen", error);
          }
        });
      } else {
        console.error("No se ha seleccionado ningún archivo");
      }
    }

}
