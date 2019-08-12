import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from '../_services/database.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private _db: DatabaseService, private _router: Router) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (
      this._db.activeUser.getValue() &&
      this._db.activeUser
        .getValue()
        .getRoles()
        .indexOf('_admin') > -1
    ) {
      return true;
    }
    this._router.navigate(['/login'], { queryParams: { returnUrl: '/home' } });
    return false;
  }
}
