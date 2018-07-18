import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { PricingComponent } from './pricing/pricing.component';
import { ContactComponent } from './contact/contact.component';
import { GalleryComponent } from './gallery/gallery.component';
import { BookingComponent } from './booking/booking.component';
import { SharedModule } from './shared/shared.module';
import { GalleryListComponent } from './gallery/gallery-list/gallery-list.component';
import { GalleryModule } from './gallery/gallery.module';



@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        PricingComponent,
        ContactComponent,
        BookingComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        SharedModule,
        GalleryModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}