import { Routes } from '@angular/router';
import { HomeComponent} from './components/home/home.component';
import { MainComponent } from './components/home/main/main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/dashboard/users/users.component';
import { ReservationsComponent } from './components/dashboard/reservations/reservations.component'
import { TablesComponent } from './components/dashboard/tables/tables.component';
import { MenuComponent } from './components/home/menu/menu.component';
import { ProductsComponent } from './components/dashboard/products/products.component';
import { ProvidersComponent } from './components/dashboard/providers/providers.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AddOrdersComponent } from './components/dashboard/tables/add-orders/add-orders.component';
import { AddTableComponent } from './components/dashboard/tables/add-table/add-table.component';
export const routes: Routes = [
    { path: '', component: HomeComponent,
      children: [{
        path: '',
        component: MainComponent
      },{
        path: 'menu',
        component: MenuComponent
      }]
    },
    {
       path: 'dashboard',
       component: DashboardComponent,
       children:[{
          path: 'users',
          component: UsersComponent,
          },{
          path: 'reservations',
          component: ReservationsComponent,
          },{
          path: 'tables',
          component: TablesComponent,
          children:[{
            path: '',
            component: AddTableComponent
          }, {
            path: 'add-orders',
            component: AddOrdersComponent
          }]
          },{
          path: 'products',
          component: ProductsComponent,
          },{
          path: 'providers',
          component: ProvidersComponent,
          }]
    },
  ];
