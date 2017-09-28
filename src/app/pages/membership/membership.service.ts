import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { User } from './membership.model';

@Injectable()
export class MembershipService {
    public headers = new Headers({ 'Content-Type': 'application/json' });
    public options = new RequestOptions({ headers: this.headers });
    public url = "api/users";
    constructor(public http:Http) { }
    
    getUsers(): Observable<User[]> {
        return this.http.get(this.url)
                        .map(this.extractData)
                        .catch(this.handleError);
    }
    
    addUser(user:User): Observable<User> {	    
        return this.http.post(this.url, user, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    updateUser(user:User): Observable<User> {
        return this.http.put(this.url + "/" + user.id, user, this.options)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    deleteUser(id: number) {
        return this.http.delete(this.url + "/" + id);
    }   	
       
    private extractData(res: Response) {
	    let body = res.json();
        if(body)
            return body.data || {};
        else
            return null;
    }
    private handleError(error: Response | any) {
        console.error(error.message || error);
        return Observable.throw(error.message || error);
    }	
} 