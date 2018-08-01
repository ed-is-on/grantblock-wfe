import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {GranteeComponent} from '../components/grantee/grantee.component'
import { GranteeService } from '../services/grantee.service'

const routes: Routes = [
  {path:'/grantee', component:GranteeComponent}
]

@NgModule({
  exports:[RouterModule],
  providers:[GranteeService],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule { }