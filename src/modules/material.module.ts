import { NgModule } from '@angular/core';
import { MatDialogModule, MatTableModule, MatPaginatorModule } from '@angular/material';

@NgModule({
  imports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule
  ],
})
export class MaterialModule { }