import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  protected readonly appName = APP_CONSTANTS.appName.toLowerCase();
  protected readonly currentYear = new Date().getFullYear();
}
