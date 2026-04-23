import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMeRequest, loginRequest } from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const login = async (correo, password) => {
  const data = await loginRequest({ correo, password });
  await AsyncStorage.setItem("token", data.access_token);
  setUser(data.user);
  return data.user;
};

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  const fetchMe = async () => {
    try {
      const me = await getMeRequest();
      setUser(me);
      return me;
    } catch (error) {
      await AsyncStorage.removeItem("token");
      setUser(null);
      throw error;
    }
  };

  const restoreSession = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      await fetchMe();
    } catch {
      setUser(null);
    } finally {
      setBootstrapping(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      isAuthenticated: !!user,
      login,
      logout,
      fetchMe,
    }),
    [user, bootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}