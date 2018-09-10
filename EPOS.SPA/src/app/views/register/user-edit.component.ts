import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUser } from '../../_models/user';
import { AuthService } from '../../_Services/auth.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy  {

  mainForm: FormGroup;
  roleList = [{value: 'Admin', display: 'Admin'}, {value: 'Manager', display: 'Manager'},
    {value: 'Staff', display: 'Staff'}];

  user: IUser = {
    id: 0,
    username: '',
    email: '',
    role: '',
    active: true,
    created: null,
    lastActive: null
  };
  updateUser: any = {};

  private sub: Subscription;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
    this.mainForm = this.fb.group({
      username: '',
      email: '',
      role: '',
      active: true,
      created: '',
      lastActive: ''
      });

  // Read the  Id from the route parameter
  this.sub = this.route.params.subscribe(
    params => {
        const id = +params['id'];
        this.getUser(id);
    }
  )
}

  ngOnDestroy(): void {
      this.sub.unsubscribe();
  }

  getUser(id: number): void {

    this.authService.getSystemUser(id)
    .subscribe(
      (user: IUser) => this.onUserRetrieved(user),
      (error: any) => this.alertify.error(error, 5)
    );
  }
  onUserRetrieved(userFromDB: IUser): void {
    this.user = userFromDB;
    // Update the data on the form
    this.mainForm.patchValue({
    username: this.user.username,
    email: this.user.email,
    role: this.user.role,
    active: this.user.active,
    created: this.user.created,
    lastActive: this.user.lastActive
    });
  }
  onValueChange(event: any) {
    this.updateUser.active = event;
  }

  saveChanges(): void {
    if (this.mainForm.dirty && this.mainForm.valid) {
      this.updateUser.Id = this.user.id;
      this.updateUser.currentRole = this.user.role;
      this.updateUser.newrole = this.mainForm.get('role').value;

      console.log(JSON.stringify(this.updateUser))

      this.authService.updateUser(this.updateUser)
      .subscribe(
          () => {
            this.alertify.success('Saved successfully', 5);
            this.router.navigate(['/be/users']);
          },
        (error: any) => this.alertify.error(error, 5)
      );
    } else {
      this.router.navigate(['/be/users']);
    }
  }
  deleteUser() {
    this.alertify.confirm(this.user.username, 'Are you sure you want to delete this user?', () => {
      this.authService.deleteUser(this.user.id).subscribe(() => {
        this.alertify.success('User has been deleted.', 5);
        this.router.navigate(['/be/users']);
      }, error => {
        this.alertify.error('Failed to delete user', 5)
      });
    });
  }
}

