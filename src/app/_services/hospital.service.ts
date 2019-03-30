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

    getByUUID(uuid: string) {
        return this.http.get(this.URL_RESOURCE_HOSPITAL + '/' + uuid);
    }


    create(hospital: Hospital) {
        return this.http.post(this.URL_RESOURCE_HOSPITAL, hospital);
    }
}
