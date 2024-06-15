import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { product } from '../../../models/product';
import { categoria } from '../../../models/categoria';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { server } from '../../../services/global';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../services/categoria.service';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

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

  deleteCategary(id: number) {
    this._CategoryService.deleteCategoria(id).subscribe({
      next: (response: any) => {
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La categoría se ha eliminado correctamente.'
        });
      },
      error: (error: any) => {
        console.error("Error al eliminar la categoría", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al eliminar la categoría. Por favor, inténtalo de nuevo.'
        });
      }
    });
  }

  filterByCategory(id: number) {
    if (id == 0) {
      this.filteredProduct = this.productLists;
    } else {
      this.filteredProduct = this.productLists.filter((product) => product.idCategoria == id);
    }
    this.currentPage = 1;
  }

  onSubmitCategory(form: any) {
    this._CategoryService.store(this.category).subscribe({
      next: (response: any) => {
        console.log(response);
        form.reset();
        this.getCategories();
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La categoría se ha registrado correctamente.'
        });
      },
      error: (error: any) => {
        console.error("Error al registrar la categoría", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar la categoría. Por favor, inténtalo de nuevo.'
        });
      }
    });
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
  toggleTable() {
    this.isTableOpen = true;
    this.isCardsOpen = false;
  }

  isEditModalOpen: boolean = false;
  productToEdit: product | null = null;

  cancelEdit() {
    this.isEditModalOpen = false;
    this.productToEdit = null;
  }

  onEdit(form: any) {
    this.productToEdit = form;
    if (this.productToEdit) {
      this.isEditModalOpen = true;
      this.product = this.productToEdit;
    }

  }

  onsubmitEdit() {
    if (this.productToEdit) {
      if (this.fileSelected) {
        this._ProductService.uploadImage(this.fileSelected).subscribe({
          next: (response: any) => {
            if (response.filename) {
              this.product.image = response.filename;
              this._ProductService.update(this.product).subscribe({
                next: (responseSub: any) => {
                  this.getProducts();
                  Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'El producto se ha actualizado correctamente.'
                  });
                },
                error: (error: any) => {
                  console.error("Error al actualizar el producto", error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al actualizar el producto. Por favor, inténtalo de nuevo.'
                  });
                }


              });
            } else {
              console.error("Falta el nombre del archivo en la respuesta");
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Falta el nombre del archivo en la respuesta del servidor.'
              });
            }
          }, error: (error: any) => {
            console.error("Error al subir la imagen", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al subir la imagen del producto. Por favor, inténtalo de nuevo.'
            });
          }
        });
      } else {
        this._ProductService.update(this.product).subscribe({
          next: (response: any) => {
            this.getProducts();
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'El producto se ha actualizado correctamente.'
            });
          },
          error: (error: any) => {
            console.error("Error al actualizar el producto", error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al actualizar el producto. Por favor, inténtalo de nuevo.'
            });
          }
        });
      }

    } else {
      console.error("No se ha seleccionado ningún producto para actualizar");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha seleccionado ningún producto para actualizar. Por favor, selecciona un producto.'
      });
    }
  }

  isDeleteModalOpen: boolean = false;
  selectedProductId: number | null = null;

  openDeleteConfirmationAndCloseShowModal(productId: number) {
    this.selectedProductId = productId;
    // Abre el modal de confirmación de eliminación
    this.openDeleteConfirmation(productId);
    // Cierra el modal de vista de detalles
    this.closeShowModal();
  }


  openDeleteConfirmation(productId: number) {
    this.selectedProductId = productId;
    this.isDeleteModalOpen = true;

  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedProductId = null;
  }

  confirmDelete() {
    console.log("ConfirmDelete llamado");

    if (this.selectedProductId !== null) {
      console.log(`Eliminando producto con ID: ${this.selectedProductId}`);

      this._ProductService.delete(this.selectedProductId).subscribe({
        next: (response: any) => {
          console.log("Producto eliminado con éxito:", response);
          this.getProducts();

          // Mostrar el SweetAlert después de que la eliminación sea exitosa
          Swal.fire({
            icon: 'success',
            title: 'Producto eliminado',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.closeDeleteModal();
          });

        },
        error: (error: any) => {
          console.error("Error al eliminar el producto", error);

          // Opcional: Mostrar una alerta en caso de error
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar el producto',
            text: 'No se pudo eliminar el producto. Inténtalo de nuevo.',
            showConfirmButton: true
          });
        }
      });
    } else {
      console.error("No se ha seleccionado ningún producto para eliminar");

      // Opcional: Manejar el caso donde no hay un producto seleccionado
      Swal.fire({
        icon: 'error',
        title: 'Ningún producto seleccionado',
        text: 'Por favor selecciona un producto para eliminar.',
        showConfirmButton: true
      });
    }
  }


  isShowModalOpen: boolean = false;

  openShowModal(productId: number) {
    this.isShowModalOpen = true;
    this.selectedProductId = productId;
    this._ProductService.getProduct(productId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.product = response.data;
        if (this.product && this.product.image) {
          this.getProductImage(this.product.image);
        }
      },
      error: (error: any) => {
        console.error("Error al obtener el producto", error);
      }
    })
  }

  closeShowModal() {
    this.isShowModalOpen = false;
    this.selectedProductId = null;
  }

  onSubmit(form: any) {
    console.log("Submitting form with product data:", this.product);
    console.log("File selected:", this.fileSelected);
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
                Swal.fire({
                  icon: 'success',
                  title: '¡Éxito!',
                  text: 'El producto se ha registrado correctamente.'
                });
              },
              error: (error: any) => {
                this.changeStatus(2);
                console.error("Error al registrar el producto", error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Hubo un error al registrar el producto. Por favor, inténtalo de nuevo.'
                });
              }
            });
          } else {
            console.error("Falta el nombre del archivo en la respuesta");
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Falta el nombre del archivo en la respuesta del servidor.'
            });
          }
        },
        error: (error: any) => {
          console.error("Error al subir la producto", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al subir la imagen del producto. Por favor, inténtalo de nuevo.'
          });
        }
      });
    } else {
      this._ProductService.store(this.product).subscribe({
        next: (response: any) => {
          if (response.status == 201) {
            form.reset();
            this.changeStatus(0);
            this.getProducts();
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'El producto se ha registrado correctamente.'
            });
          } else {
            this.changeStatus(1);
            Swal.fire({
              icon: 'warning',
              title: 'Advertencia',
              text: 'Hubo un problema al registrar el producto. Por favor, inténtalo de nuevo.'
            });
          }
        },
        error: (error: any) => {
          this.changeStatus(2);
          console.error("Error al registrar el producto", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al registrar el producto. Por favor, inténtalo de nuevo.'
          });
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


  captureFile(event: any) {
    let file = event.target.files[0];
    this.fileSelected = file;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
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
