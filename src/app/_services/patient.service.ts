import {Injectable} from '@angular/core';
import {Constants} from '@app/constants';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Patient} from '@app/_models/patient';
import {Doctor} from '@app/_models/doctor';
import {environment} from '@environments/environment';


@Injectable({providedIn: 'root'})
export class PatientService {
    URL_RESOURCE_PATIENT = Constants.API_ENDPOINT + '/api/patient';
    constructor(private http: HttpClient) {
    }


  register(patient: Patient) {
    return this.http.post( `${environment.apiUrl}/api/patient/register`, patient);
  }

    getAll() {
        return this.http.get(this.URL_RESOURCE_PATIENT);
    }

    getByUUID(uuid: string) {
        return this.http.get(this.URL_RESOURCE_PATIENT + '/' + uuid);
    }


    getHospitalDoctors(doctorUUID: string) {
        return this.http.get(this.URL_RESOURCE_PATIENT + '/doctor/' + doctorUUID);
    }

    addDiagnose(uuid: string, diagnose: string, doctorUUID: string) {
        const params = new HttpParams();
        params.set('diagnose', diagnose);
        params.set('doctor-uuid', doctorUUID);
        return this.http.put(this.URL_RESOURCE_PATIENT + '/' + uuid + '/diagnose', params);
    }
}
