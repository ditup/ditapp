import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';

const MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRadioModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class MaterialModule { }
