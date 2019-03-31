import {Injectable} from '@angular/core';
import {Constants} from '@app/constants';
import {HttpClient} from '@angular/common/http';
import {Hospital} from '@app/_models/hospital';
import {environment} from '@environments/environment';


@Injectable({providedIn: 'root'})
export class HospitalService {
    URL_RESOURCE_HOSPITAL = Constants.API_ENDPOINT + 'api/hospital';
    constructor(private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Hospital[]>( `${environment.apiUrl}/api/hospital`);
    }


    create(hospital: Hospital) {
        return this.http.post(( `${environment.apiUrl}/api/hospital`), hospital);
    }
}
