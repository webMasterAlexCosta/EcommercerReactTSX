import { createContext } from "react";

interface IconAdminContext {
    iconAdminContext: boolean;
    setIconAdminContext: (iconAdminContext: boolean) => void;
}
const IconAdminContext = createContext<IconAdminContext>({
    iconAdminContext: false,
  setIconAdminContext: () => {},
});
export default IconAdminContext;
