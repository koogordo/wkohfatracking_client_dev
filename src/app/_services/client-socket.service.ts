import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { CommEvent, IWKORequest, IWKONotification, IWKOMessage } from "./WKOCommunication";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ClientSocketService {
  socket;
  notificationSubject: BehaviorSubject<IWKONotification>;
  requestErrorSubject: BehaviorSubject<any>;
  constructor() {
    this.notificationSubject = new BehaviorSubject<IWKONotification>(null);
    this.requestErrorSubject = new BehaviorSubject<any>(null);
  }
  createInstance(user: string) {
    this.socket = io("https://wkohfatracking.centralus.cloudapp.azure.com", {
      rejectUnauthorized: false,
      secure: true,
      query: `user=${user}`,
      transports: ["websocket"],
      path: "/wkocomms/socket.io",
    });
    //this.socket.connect();
    this.acceptEvents();
  }

  getInstance() {
    return this.socket;
  }
  private acceptEvents() {
    this.socket.on(CommEvent.NOTIFICATION, (data: IWKONotification) => {
      console.log("We were notified");
      this.notificationSubject.next(data);
    });
    this.socket.on(CommEvent.REQ_ERR, (data) => {
      this.requestErrorSubject.next(data);
    });
    this.socket.on("message", (data) => {
      console.log(data);
    });
    this.socket.on("disconnect", () => {
      this.socket.open();
    });
  }

  notifications() {
    return this.notificationSubject;
  }
  requestErrors() {
    return this.requestErrorSubject;
  }

  makeRequest(action, user, form, notify, userDB) {
    const req: IWKORequest = {
      action: action,
      doNotify: notify,
      notifyGroup: user.getReviewGroup(),
      visit: form,
      reqUser: user.getID(),
      userDB: userDB,
    };
    console.log("user request in client: " + user);
    this.socket.emit(CommEvent.REQUEST, req);
  }
}
