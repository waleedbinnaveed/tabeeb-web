import {Doctor} from '@app/_models/doctor';
import {User} from '@app/_models/user';


export class Patient {
   diagnose: string;
   doctor: Doctor;
   user: User;
}
