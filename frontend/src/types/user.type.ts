export interface UserRegisterData {
  name: string; email: string; password: string; confirmPassword: string; location?: UserLocationType;
}
export interface UserLoginData { email: string; password: string; }
export interface User {
  id: string; name: string; email: string; role: "USER" | "ADMIN"; location?: UserLocationType;
}
export interface UserLocationType {
  address: string; city: string; state: string; country: string;
  latitude?: number | null; longitude?: number | null; pincode: string;
}
export interface UserUpdateDataType { name?: string; location?: Partial<UserLocationType>; }
export type UserUpdateDataTyep = UserUpdateDataType;
