import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RpUtilsModule } from './utils/rp-utils.module';

import { ChartsModule } from 'ng2-charts';
import { ToasterService } from './shared/toastr.service';
import { GraphQLModule } from './graphql.module';

import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { environment } from 'src/environments/environment';
import { ImageService } from './Providers/image-controller/image.service';

import { AuthModule } from '@auth0/auth0-angular';
import { JWTTokenService } from './Providers/jwt/jwttoken.service';
import { LocalStorageService } from './Providers/local-storage/local-storage.service';
import { AuthInterceptor } from './Providers/auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    RpUtilsModule,
    ChartsModule,
    GraphQLModule,
     // Import the module into the application, with configuration
     AuthModule.forRoot({
      domain: 'reading-pal.us.auth0.com',
      clientId: '8IUEIIpjpqY74hTMJI2LRuR3FN4uz0ca'
    }),
  ],
  providers: [
    ToasterService,
    ImageService,
    JWTTokenService,
    LocalStorageService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: environment.graphqlApiGateway,
          }),
        };
      },
      deps: [HttpLink],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
