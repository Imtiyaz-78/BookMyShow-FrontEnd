import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { YourOrderComponent } from './your-order/your-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [YourOrderComponent, ProfileComponent],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [BsModalService],
})
export class UserProfileModule {}
