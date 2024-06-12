import { Component,Inject,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { user } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { timer } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
    public user:user;
    private status:number;
    public userLists: user[];
    public fileSelected: any;
    public previsualizacion: string="";



    constructor(
        private _userService:UserService,
        private _router:Router,
        private sanitizer: DomSanitizer

    ){
        this.user = new user(1,"","","","","","","","");
        this.status = -1;
        this.userLists= [];
        this.filteredUser = this.userLists;

    }

    ngOnInit(): void{
        this.getUsers();
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

        this._userService.delete(this.selectedUserId).subscribe({
          next: (response: any) => {
            console.log(response);
            this.getUsers();
          },
          error: (error: any) => {
            console.error("Error al eliminar el usuario", error);
          }
        });
      }
      this.closeDeleteModal();
    }

    isShowModalOpen:boolean = false;

    openShowModal(userId:number) {
      this.isShowModalOpen = true;
      this.selectedUserId = userId;
      this._userService.getUser(userId).subscribe({
        next: (response: any) => {
          console.log(response);
           this.user = response.data;
        },
        error: (error: any) => {
          console.error("Error al obtener el usuario", error);
        }
      })
    }

    closeShowModal() {
      this.isShowModalOpen = false;
      this.selectedUserId = null;
    }



    onSubmit(form: any) {
      if (this.fileSelected) {
        this._userService.uploadImage(this.fileSelected).subscribe({
          next: (response: any) => {
            if (response.filename) {
              this.user.image = response.filename;
              this._userService.register(this.user).subscribe({
                next: (responseSub: any) => {
                  form.reset();
                  this.changeStatus(0);
                  this.getUsers();
                },
                error: (error: any) => {
                  this.changeStatus(2);
                  console.error("Error al registrar el usuario", error);
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
        this._userService.register(this.user).subscribe({
          next: (response: any) => {
            if (response.status == 201) {
              form.reset();
              this.changeStatus(0);
              this.getUsers();
            } else {
              this.changeStatus(1);
            }
          },
          error: (error: any) => {
            this.changeStatus(2);
            console.error("Error al registrar el usuario", error);
          }
        });
      }
    }

    getUsers() {
        this._userService.getUsers().subscribe({
            next: (response: any) => {
                console.log(response);
                this.userLists = response.data;
                // Asegúrate de que estás accediendo a 'data' en la respuesta
                this.filteredUser = this.userLists;
                this.visibleData();
            },
            error: (error: any) => {
                console.error("Error al obtener los Usuarios", error);
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
    filteredUser: Array<user> = [];

    visibleData(){
        let start = (this.currentPage-1)*this.pageSize;
        let end = start + this.pageSize;
        return this.filteredUser.slice(start,end);
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
      let totalPage = Math.ceil(this.userLists.length/this.pageSize);
      let pageNumArray = new Array(totalPage);
      return pageNumArray;

    }
    filterData(searchTerm: string) {
        this.filteredUser = this.userLists.filter((item) => {
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
        this._userService.getImage(filename).subscribe({
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
        this._userService.uploadImage(file).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.filename) {
              this.user.image = response.filename;
              this._userService.register(this.user).subscribe({
                next: (responseSub: any) => {
                  console.log(responseSub);
                  this.getUsers();
                },
                error: (error: any) => {
                  console.error("Error al registrar el usuario", error);
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
