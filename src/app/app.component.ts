import { Component } from '@angular/core';

import { ModelService } from './model.service';
import { BasicAuthService } from './basic-auth.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ModelService, BasicAuthService, AuthService]
})
export class AppComponent {
  options = {};
}
