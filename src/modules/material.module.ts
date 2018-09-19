import { NgModule } from '@angular/core';
import { MatDialogModule, MatTableModule, MatPaginatorModule, MatSortModule, MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
  exports: [
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
})
export class MaterialModule { }