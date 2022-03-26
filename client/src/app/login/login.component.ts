import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OauthService } from '../oauth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  AuthUrl!: string;
  constructor(private serv: OauthService, private router: Router) {}

  ngOnInit(): void {
    this.serv.GetAuthPage().subscribe(
      (data: any) => (this.AuthUrl = data['authUrl']),
      (err: any) => {
        console.log(err);
      }
    );
  }

  login() {
    this.router.navigate(['/test'], { queryParams: { url: this.AuthUrl } });
  }
}
