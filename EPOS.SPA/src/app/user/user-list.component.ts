import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ActivatedRoute } from '@angular/router';

import { AlertifyService } from './../core/alertify.service';
import { ISystemUser } from './../_models/user';
import { UserService } from './user.service';
import { RolesModalComponent } from './roles-modal.component';
import { MessageModalComponent } from './../shared/message-modal.component';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: ISystemUser[];
  bsModalRef: BsModalRef;
  constructor(private userService: UserService,
    private alertify: AlertifyService,
    private modalService: BsModalService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe(data => {
      this.users = data['users'];
    })
  }

  editRolesModal(user: ISystemUser) {
    const initialState = {
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.userService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames];
          this.alertify.success('User roles updated successfully.', 5);
        }, error => {
          this.alertify.error(error, 5)
        });
      }
    });
  }

  private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Manager', value: 'Manager'},
      {name: 'Supervisor', value: 'Supervisor'},
      {name: 'Staff', value: 'Staff'},
    ];

    for (let i = 0; i < availableRoles.length; i++) {
      let isMatch = false;
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].name === userRoles[j]) {
          isMatch = true;
          availableRoles[i].checked = true;
          roles.push(availableRoles[i]);
          break;
        }
      }
      if (!isMatch) {
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
  }
  deleteUser(user: ISystemUser) {

    const initialState = {
      title : user.fullName,
      message: 'Are you sure you want to delete this user'
    };
    this.bsModalRef = this.modalService.show(MessageModalComponent, {initialState});
    this.bsModalRef.content.msgResponse.subscribe((value) => {
    if (value) {
      this.userService.deleteUser(user).subscribe(() => {
      this.alertify.success('User has been deleted.', 5);
      this.users = this.users.filter(p => p.email !== user.email);
      });
    }
    });
  }
}
