import type { User,UserLoginData,UserRegisterData } from "./user.type";

export interface GlobalContextType {
  user: User | null;
  isAuthenticated : boolean,
  loading: boolean;
  register: (data: UserRegisterData) => Promise<void>;
  login: (data: UserLoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}