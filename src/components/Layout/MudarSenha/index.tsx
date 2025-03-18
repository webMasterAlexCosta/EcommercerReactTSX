import RedefinirSenha from "../../UI/RedefinirSenha"
import * as authService from "../../../services/AuthService"
import { useEffect, useState } from "react"

const MudarSenha = () => {
    const token = authService.isAuthenticated()
    const [isToken, setIsToken] = useState<boolean>(false)
    useEffect(() => {
        if (token) {
            setIsToken(token)
        }
    }, [token])

    return (
        <>
            <main>
                
                <RedefinirSenha isToken={isToken} />
            </main>
        </>
    )
}
export { MudarSenha }