import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../_Services/auth.service';
import { AlertifyService } from '../../_Services/alertify.service';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  model: any = {};
  formError: string;
  submitting = false;
  returnUrl: string;

  constructor(private router: Router, private authService: AuthService,
    private alertify: AlertifyService, private route: ActivatedRoute ) { }


  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  login(loginForm: NgForm) {

    if (loginForm.valid) {

      this.submitting = true;
      this.formError = null;

      this.authService.login(this.model).subscribe(data => {
        this.alertify.success('Logged in successfully', 5);
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/be/dashboard']);
        }

      }, error => {
        this.submitting = false;
        this.formError = 'Sorry, we couldn\'t log you in. Please try again, or reset your password.';
        }, () => {
           this.submitting = false;
      });
    }
  }

}

