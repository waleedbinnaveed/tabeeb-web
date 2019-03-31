import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {Patient} from '@app/_models/patient';
import {PatientService} from '@app/_services/patient.service';
import {User} from '@app/_models';
import {AlertService, DoctorService, UserService} from '@app/_services';
import {HospitalService} from '@app/_services/hospital.service';
import {Doctor} from '@app/_models/doctor';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Hospital} from '@app/_models/hospital';


@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  diagnoseForm: FormGroup;
  hospitalForm: FormGroup;
  user: User ;
  patient: Patient;
  doctor: Doctor;
  currentUser: User ;
  patients: Patient[] = [];
  hospitals: Hospital[] = [];
  hospitalDoctors: Doctor[] = [];
  patientUUIDDiagnose: string;
  doctorUUIDDiagnose: string;
  role: any;
  doctor_profile_flag = true;
  doctor_pm_flag = false;
  diagnose_flag = false;
  hospitalList_flag = true;
  hospitalDetails_flag = false;
  createHospital_flag = false;
  hospital: Hospital;



  constructor(private patientService: PatientService,
              private doctorService: DoctorService,
              private hospitalService: HospitalService,
              private userService: UserService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private router: Router

  ) {

  }


  ngOnInit() {

    this.diagnoseForm = this.formBuilder.group({
      diagnosetext: ['', Validators.required]
    });

    this.hospitalForm = this.formBuilder.group({
      hospitalname: ['', Validators.required],
      hospitaladdress: ['', Validators.required]


    });



    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.fetchUserByUsername();
    this.role = this.currentUser.authorities[0].role;

    if (this.role === 'PATIENT') {
      this.fetchPatientByUserName();
    }

    if (this.role === 'DOCTOR') {
      this.fetchDoctorByUserName();
    }

    if (this.role === 'ADMIN') {
      this.fetchHospitals();
    }


  }

  get f() {
    return this.diagnoseForm.controls;
  }

  private fetchUserByUsername() {
    this.userService.getByUserName(this.currentUser.username).subscribe(
      user => {
        this.user = user;
      }, failure => {
        this.alertService.error('Something goes wrong');
      }
    );
  }

  private fetchPatientByUserName() {
    this.patientService.getByUserName(this.currentUser.username).subscribe(
      patient => {
        this.patient = patient;
      }, failure => {
        this.alertService.error('Something goes wrong');
      }
    );
  }

  private fetchDoctorByUserName() {
    this.doctorService.getByUserName(this.currentUser.username).subscribe(
      doctor => {
        this.doctor = doctor;
      }, failure => {
        this.alertService.error('Something goes wrong');
      }
    );
  }

  public loadPatientAction() {

    this.doctor_profile_flag = false;
    this.doctor_pm_flag = true;
    if (this.patients.length === 0) {
      this.loadAllPatients(); // avoid many calls to server
    }

  }
  private loadAllPatients() {
    this.patientService.getPatientByDoctor(this.doctor.user.uuid).pipe(first()).subscribe(patients => {
      this.patients = patients;
    }
    );
  }

  public addDiagnoseAction(patientuuid: string, doctoruuid: string) {
    this.diagnose_flag = true;
    this.doctor_pm_flag = false;
    this.doctor_profile_flag = false;
    this.patientUUIDDiagnose = patientuuid;
    this.doctorUUIDDiagnose = doctoruuid;


    console.log('patient uuid*', patientuuid);
    console.log('doctor uuid*', doctoruuid);

  }

  public onDiagnoseFormSubmit() {

    this.patientService
      .addDiagnose(this.patientUUIDDiagnose, this.doctorUUIDDiagnose, this.diagnoseForm.get('diagnosetext').value).subscribe(

      response => {
        this.alertService.success('Diagnose added', true);
        this.router.navigate(['/login']);

      },
      failure => {


      }
    );
  }

  private fetchHospitals() {
    this.hospitalService.getAll().subscribe(
      response => {
        this.hospitals = response;
      },
      failure => {
        this.alertService.error('Something goes wrong');
        this.router.navigate(['/login']);
      }

    );
  }

  public viewHospitalDetailsAction(hospital: Hospital) {
    this.hospitalDetails_flag = true;
    this.hospital = hospital;
    this.hospitalList_flag = false;
    this.loadDoctorsByHospital();
  }

  private loadDoctorsByHospital() {
    this.doctorService.getHospitalDoctors(this.hospital.uuid).subscribe(
      response => {
        this.hospitalDoctors = response;
      }
      ,
      failure => {
        this.alertService.error('Something goes wrong');
        // this.router.navigate(['/login']);
      }
    );
  }

  public onHospitalFormSubmit() {

    console.log(this.hospitalForm.get('hospitalname').value);
    console.log(this.hospitalForm.get('hospitaladdress').value);
    // stop here if form is invalid
    if (this.hospitalForm.invalid) {
      return;
    }
    const hospitalobj = <Hospital>{
      name: this.hospitalForm.get('hospitalname').value,
      address: this.hospitalForm.get('hospitaladdress').value
    };
    this.hospitalService.create(hospitalobj).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      failure => {
        this.router.navigate(['/login']);
      }
    );
  }

}
