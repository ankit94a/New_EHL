import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from 'projects/shared/src/service/auth-interceptor.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
        provideToastr(),
        provideAnimationsAsync(),
        importProvidersFrom(MatNativeDateModule),
        importProvidersFrom(HttpClientModule),
        provideHttpClient(withInterceptors([authInterceptor])),
        importProvidersFrom(NgxSpinnerModule),
        importProvidersFrom(NgxExtendedPdfViewerModule)
  ]
};
