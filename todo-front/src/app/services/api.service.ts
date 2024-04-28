import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private token: string = '';
  private jwtToken$ = new BehaviorSubject<string>(this.token);
  private API_URL = 'http://localhost:3000/api';
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {
    if (typeof localStorage !== 'undefined') {
      const fetchedToken = localStorage.getItem('accessToken');

      if (fetchedToken) {
        this.token = atob(fetchedToken);
        this.jwtToken$.next(this.token);
      }
    }
  }

  get jwtUserToken(): Observable<string> {
    return this.jwtToken$.asObservable();
  }

  getAllTodos(): Observable<any> {
    return this.http.get(`${this.API_URL}/todo`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  createTodo(title: string, description: string) {
    return this.http
      .post(
        `${this.API_URL}/todo`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.toast.error(err.error.message, '', {
            timeOut: 1000,
            positionClass: 'toast-top-center',
          });
          return throwError(() => err);
        })
      );
  }

  updateStatus(statusValue: string, todoId: number) {
    return this.http
      .patch(`${this.API_URL}/todo/${todoId}`, {
        status: statusValue,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        tap((res) => {
          if (res) {
            this.toast.success('Zaktualizowano status.', '', {
              timeOut: 700,
              positionClass: 'toast-top-center',
            });
          }
        })
      );
  }

  deleteTodo(todoId: number) {
    return this.http
      .delete(`${this.API_URL}/todo/${todoId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        tap((res) => {
          if (res) {
            this.toast.success('Usunięto pomyślnie.', '', {
              timeOut: 700,
              positionClass: 'toast-top-center',
            });
          }
        })
      );
  }

  login(username: string, password: string) {
    this.http
      .post<{ token: string }>(`${this.API_URL}/auth/login`, {
        username,
        password,
      })
      .subscribe({
        next: (res: { token: string }) => {
          this.token = res.token;
          if (this.token) {
            this.toast
              .success('Zalogowano.', '', {
                timeOut: 700,
                positionClass: 'toast-top-center',
              })
              .onHidden.subscribe(() => {
                this.jwtToken$.next(this.token);
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem('accessToken', btoa(this.token));
                }
                this.router.navigateByUrl('/').then();
              });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toast.error('Niepowodzenie uwierzytelniania.', '', {
            timeOut: 2000,
            positionClass: 'toast-top-center',
          });
        },
      });
  }

  logout() {
    this.token = '';
    this.jwtToken$.next(this.token);
    this.toast
      .success('Wylogowano.', '', {
        timeOut: 700,
        positionClass: 'toast-top-center',
      })
      .onHidden.subscribe(() => {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('accessToken');
        }
        this.router.navigateByUrl('/login').then();
      });
  }

  register(username: string, password: string) {
    return this.http
      .post(`${this.API_URL}/auth/register`, { username, password })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.toast.error(err.error.message, '', {
            timeOut: 1000,
            positionClass: 'toast-top-center',
          });
          return throwError(() => err);
        })
      );
  }
}
