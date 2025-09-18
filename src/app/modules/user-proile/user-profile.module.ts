import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { YourOrderComponent } from './your-order/your-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [YourOrderComponent, ProfileComponent],
  imports: [CommonModule, UserProfileRoutingModule, ReactiveFormsModule],
  providers: [BsModalService],
})
export class UserProfileModule {}
