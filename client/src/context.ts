import { createContext } from "react";
import { ApiUser } from "../../server/src/app";

export const UserContext = createContext<{ user: ApiUser | null, reloadUser: Function }>({ user: null, reloadUser: () => { } });
