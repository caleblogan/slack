import { createContext } from "react";
import { ApiUser } from "../../server/src/app";

export const UserContext = createContext<ApiUser | null>(null);
