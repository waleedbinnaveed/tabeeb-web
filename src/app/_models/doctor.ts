import {Hospital} from '@app/_models/hospital';
import {User} from '@app/_models/user';

export class Doctor {
    hospital: Hospital;
    kind: string;
    user: User;
}
