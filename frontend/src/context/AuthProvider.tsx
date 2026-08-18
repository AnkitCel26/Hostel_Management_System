import { useState, useEffect, type ReactNode } from "react";
import { useQuery } from "@apollo/client/react";

import AuthContext from "./AuthContext";
import { ME } from "../graphql/Profile.api";
import type { User } from "../types/auth.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const { data, loading } = useQuery(ME);

  useEffect(() => {
    if (!loading) {
      setUser(data?.me ?? null);
      setInitializing(false);
    }
  }, [data, loading]);

  if (initializing) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};