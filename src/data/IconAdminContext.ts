import { createContext } from "react";

interface IIconAdminContext {
    iconAdminContext: boolean;
    setIconAdminContext: (iconAdminContext: boolean) => void;
}
const IconAdminContext = createContext<IIconAdminContext>({
    iconAdminContext: false,
  setIconAdminContext: () => {},
});
export default IconAdminContext;
