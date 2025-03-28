import RedefinirSenha from "../../UI/RedefinirSenha"
import * as authService from "../../../services/AuthService"
import { useEffect, useState } from "react"

const MudarSenha = () => {
    const token = authService.isAuthenticated()
    const [isToken, setIsToken] = useState<boolean>(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
   

    useEffect(() => {
        if (token) {
            setIsToken(token)
        }
    }, [token])

    useEffect   (()=>{  
        setIsSubmitted(false)
    },[isSubmitted])

    return (
        <>
            <main>
                
                <RedefinirSenha  isToken={isToken} isSubmitted={isSubmitted} />
            </main>
        </>
    )
}
export { MudarSenha }