import {Injectable} from '@angular/core';
import {Constants} from '@app/constants';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Patient} from '@app/_models/patient';
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
        return this.http.get<Patient[]>(`${environment.apiUrl}/api/patient`);
    }

    getByUUID(uuid: string) {
        return this.http.get<Patient>(`${environment.apiUrl}/api/patient/${uuid}`);
    }


    getPatientByDoctor(doctorUUID: string) {
        return this.http.get<Patient[]>(`${environment.apiUrl}/api/patient/doctor/${doctorUUID}`);
    }

    addDiagnose(uuid: string, doctorUUID: string, diagnose: string) {
        let params = new HttpParams();
      // params.set('doctor-uuid', doctorUUID);
      // params.set('diagnose', diagnose);
      params = params.append('doctor-uuid', doctorUUID);
      params = params.append('diagnose', diagnose);

      return this.http.put(`${environment.apiUrl}/api/patient/${uuid}/diagnose`, params);
    }

  getByUserName(username: string) {
    return this.http.get<Patient>(`${environment.apiUrl}/api/patient/${username}/username`);
  }
}
