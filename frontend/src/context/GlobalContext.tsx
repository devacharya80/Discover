import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import type { User, UserLoginData, UserRegisterData } from "../types/user.type";
import type { GlobalContextType } from "../types/global.type";
import { registerUser, logOutUser, loginUser } from "../api/auth.api";
import { getUserProfile } from "../api/user.api";

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try{
        setLoading(true);
        const userProfile = await getUserProfile();
        setUser(userProfile.data);
      }catch(err : any){
        console.log(err.message)
      }finally{
        setLoading(false)
      }
    }
    fetchUserProfile();
  },[])

 const register = async (data: UserRegisterData) => {
  try {
    setLoading(true);
    const response = await registerUser(data);
    setUser(response.data); // ✅ Was response.user
  } catch (err) {
    console.error(err);
    throw err; // ✅ Must rethrow so Register.tsx can catch it
  } finally {
    setLoading(false);
  }
};

  const login = async (data: UserLoginData) => {
  try {
    setLoading(true);
    const response = await loginUser(data);
    setUser(response.data); // ✅ Was response.user
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    try {
      setLoading(true);
      await logOutUser();
      setUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        login,
        isAuthenticated: user !== null,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for safe consumption
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};