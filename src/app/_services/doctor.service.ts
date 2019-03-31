import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Doctor} from '@app/_models/doctor';
import {environment} from '@environments/environment';
import {User} from '@app/_models';
import {Patient} from '@app/_models/patient';


@Injectable({providedIn: 'root'})
export class DoctorService {

  constructor(private http: HttpClient) {
  }

  register(doctor: Doctor) {
    return this.http.post(`${environment.apiUrl}/api/doctor/register`, doctor);
  }

  getAll() {
    return this.http.get<Doctor[]>(`${environment.apiUrl}/api/doctor`);

  }

  getByUserName(username: string) {
    return this.http.get<Doctor>(`${environment.apiUrl}/api/doctor/${username}/username`);
  }

  getByUUID(uuid: string) {
    return this.http.get(`${environment.apiUrl}/api/doctor/${uuid}`);
  }

  getHospitalDoctors(hospitalUUID: string) {
    return this.http.get<Doctor[]>(`${environment.apiUrl}/api/doctor/hospital/${hospitalUUID}`);
  }

}
