import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OauthService } from '../oauth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private active: ActivatedRoute,
    private serv: OauthService,
    private router: Router
  ) {}
  username!: string;

  ngOnInit(): void {
    this.serv.getUserDetails().subscribe(
      (data:any) => (this.username = data["login"]),
      (err) => {
        console.log(err);
      }
    );
  }
  logout() {
    this.serv.logout().subscribe(
      (data) => this.router.navigate(['/login']),
      (err) => {
        console.log(err);
      }
    );
  }
}
