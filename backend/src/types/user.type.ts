export interface UserType {
  id: string;
  email: string;
  name: string;
  location: UserLocationType | null
}

export interface UserLocationType{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    address: string;
    city: string;
    state: string;
    country: string;
    latitude: number | null;
    longitude: number | null;
    pincode: string;
    userId: string; 
};