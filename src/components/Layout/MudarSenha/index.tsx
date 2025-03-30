import RedefinirSenha from "../../UI/RedefinirSenha"
import * as authService from "../../../services/AuthService"
import { useEffect, useState } from "react"

const MudarSenha = () => {
   
    const [isToken, setIsToken] = useState<boolean>(false)
    const [isSubmitted, setIsSubmitted] = useState(false);
   

    useEffect(() => {
        const verificar = async()=>{
            const token = await authService.isAuthenticated()
            if (token) {
                setIsToken(token)
            }
        }
        verificar()
        
    }, [])

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