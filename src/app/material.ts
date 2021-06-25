import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule,
        MatInputModule, MatTabsModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatBadgeModule, MatTooltipModule,
        MatSelectModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule,MatGridListModule,MatListModule,MatExpansionModule,
        MatFormFieldModule,MatAutocompleteModule,MatDatepickerModule,MatFormFieldModule, MatInputModule,MatNativeDateModule,MatDialogModule,MatRadioModule,
        MatSidenavModule,MatProgressBarModule,MatSlideToggleModule,MatSliderModule,MatChipsModule,MatButtonToggleModule
         
    ],
    exports: [MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule,
        MatInputModule, MatTabsModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatBadgeModule, MatTooltipModule,
        MatSelectModule,MatSnackBarModule,MatProgressSpinnerModule,MatStepperModule,MatGridListModule,MatListModule,MatExpansionModule,
        MatFormFieldModule,MatAutocompleteModule,MatDatepickerModule,MatNativeDateModule ,MatDialogModule,MatTreeModule,MatRadioModule,
        MatSidenavModule,MatProgressBarModule,MatSlideToggleModule,MatSliderModule,MatChipsModule,MatButtonToggleModule
    ]
})
export class MaterialModule { }