import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
@Injectable()
export class ConnectionService {
  public onlineStatus = new BehaviorSubject<boolean>(true);

  public offlineEvent = fromEvent(window, 'offline');
  constructor() {
    fromEvent(window, 'online').subscribe(() => {
      this.handleOnlineChange(true);
    });
    fromEvent(window, 'offline').subscribe(() => {
      this.handleOnlineChange(false);
    });
  }

  private handleOnlineChange(online: boolean) {
    if (online !== this.onlineStatus.getValue()) {
      this.onlineStatus.next(online);
    }
  }

  public connection() {
    return this.onlineStatus;
  }

  public setOffline() {
    this.onlineStatus.next(false);
  }
}
