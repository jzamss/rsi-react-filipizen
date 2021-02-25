import { createContext } from "react";

const userContext = createContext();
userContext.displayName = "User";

export default userContext;
