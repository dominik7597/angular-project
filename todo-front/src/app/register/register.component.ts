import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {}

  register(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    const { username, password } = registerForm.value;
    this.apiService
      .register(username, password)
      .subscribe((res) => registerForm.reset());
    this.router.navigateByUrl('/').then();
  }
}
