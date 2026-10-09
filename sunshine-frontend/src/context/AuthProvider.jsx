import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { isAdminUser } from "../utils/auth";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, isAdmin: false, loading: true });

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        const isAdmin = await isAdminUser(user).catch(() => false);
        setState({ user, isAdmin, loading: false });
      }),
    [],
  );

  const value = useMemo(() => ({ ...state, logout: () => signOut(auth) }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
