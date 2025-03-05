import { createContext } from "react"

interface ILoginContext{
    contextIsLogin:boolean
    setContextIsLogin:(contextIsLogin:boolean)=>void
}
const ContextIsLogin = createContext<ILoginContext>({
    contextIsLogin: false,
    setContextIsLogin: () => {}
})
export default ContextIsLogin