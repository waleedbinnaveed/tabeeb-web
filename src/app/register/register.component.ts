import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AlertService, AuthenticationService} from '@app/_services';
import {DoctorService} from '@app/_services/doctor.service';
import {PatientService} from '@app/_services/patient.service';
import {Hospital} from '@app/_models/hospital';
import {HospitalService} from '@app/_services/hospital.service';
import {first} from 'rxjs/operators';
import {User} from '@app/_models';
import {Doctor} from '@app/_models/doctor';
import {Patient} from '@app/_models/patient';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  hospitals: Hospital[] = [];
  doctors: Doctor[] = [];
  selectedHospitalUUID: any;
  selectedDoctorUUID: any;
  doctorSignUp = false;
  patientSignUp = false;
  selectionButtons = true;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private alertService: AlertService,
    private hospitalService: HospitalService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      age: ['', Validators.required],
      mobileNo: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.loadAllHospitals();


  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }


  /*******************************
   * Load list of HOSPITAL API*
   *******************************/
  private loadAllHospitals() {
    this.hospitalService.getAll().pipe(first()).subscribe(hospitals => {
      this.hospitals = hospitals;
    });
  }

  /*******************************
   * Load list of DOCTOR API*
   *******************************/
  private loadAllDoctors() {
    this.doctorService.getAll().pipe(first()).subscribe(doctors => {
      this.doctors = doctors;
    });
  }

  /*******************************
   * Set Hospital on DROPDOWN *
   *******************************/
  hospitalUUID(filterUUIDval: any) {
    this.selectedHospitalUUID = filterUUIDval;
  }

  /*******************************
   * Set Doctor on DROPDOWN *
   *******************************/
  doctorUUID(filterUUIDval: any) {
    this.selectedDoctorUUID = filterUUIDval;
  }


  /*******************************
   * ON SUBMIT - REGISTER BUTTON *
   *******************************/

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const userobj = <User>{
      name: this.registerForm.get('name').value,
      username: this.registerForm.get('username').value,
      age: this.registerForm.get('age').value,
      password: this.registerForm.get('password').value,
      gender: 'gender',
      mobileNo: this.registerForm.get('mobileNo').value
    };

    if (this.doctorSignUp) {
      // same for both registrations

      const hospitalobj = <Hospital>{uuid: this.selectedHospitalUUID};
      const doctorobj = <Doctor>{user: userobj, hospital: hospitalobj, kind: 'Doctor'};


      this.doctorService.register(doctorobj).pipe(first()).subscribe(
        data => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        error => {

          this.alertService.error('Something goes wrong');
          this.loading = false;
        }
      );

    }// end doctor signup

    if (this.patientSignUp) {
      const userdoctorobj = <User>{uuid: this.selectedDoctorUUID};
      const patientDoctorObj = <Doctor>{user: userdoctorobj};
      const patientobj = <Patient>{user: userobj, doctor: patientDoctorObj};

      this.patientService.register(patientobj).pipe(first()).subscribe(
        response => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },

        error => {
          this.alertService.error('Something goes wrong');
          this.loading = false;
        }
      );

    } // end patient signup


  }

}
