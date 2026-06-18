import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly userService = inject(UserService);

  protected readonly appName = APP_CONSTANTS.appName.toLowerCase();
  protected readonly currentUser = this.userService.currentUser;
  protected readonly isAuthenticated = this.userService.isAuthenticated;
}
