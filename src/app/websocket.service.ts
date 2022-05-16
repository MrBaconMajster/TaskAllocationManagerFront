import {Injectable} from '@angular/core';
import * as Rx from 'rxjs';
import { Subject } from 'rxjs';
import { share } from "rxjs/operators";

Injectable()
@Injectable()
export class WebsocketService {
    public messages: Subject<any>;
    private subject: Rx.Subject<any>;
    public share = share;
    public ws: any;
    constructor() {
    }
    public connect(url: string): Rx.Subject<any> {
        if (!this.subject) {
            this.subject = this.create(url);
        }
        return this.subject;
    }

    private create(url: string): Rx.Subject<any> {
        this.ws = new WebSocket(url);
        const observable = Rx.Observable.create(
            (obs: Rx.Observer<any>) => {
                this.ws.onmessage = obs.next.bind(obs);
                this.ws.onerror = obs.error.bind(obs);
                this.ws.onclose = obs.complete.bind(obs);
                return this.ws.close.bind(this.ws);
            }).pipe(share())
    
        const observer = {
            next: (data: Object) => {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(data));
                }
            }
        };
        return Rx.Subject.create(observer, observable);
    }
}