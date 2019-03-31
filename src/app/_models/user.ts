import {Authority} from '@app/_models/authority';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  token: string;
// myobj
  username: string;
  password: string;
  age: number;
  gender: string;
  mobileNo: string;
  name: string;
  userType: string;
  uuid: string;
  authorities: Authority[];
}
