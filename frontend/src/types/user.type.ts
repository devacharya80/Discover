export interface UserRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location? : UserLocationType
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  location? : UserLocationType
}

export interface UpdateUserProfileType {}

export interface UserLocationType {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude? : number,
  longitude? : number
  pincode: string;
}
