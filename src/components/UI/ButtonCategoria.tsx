interface ButtonCategoriaProps {
    nomeCategoria?: string ;  
}

const ButtonCategoria = ({nomeCategoria = "Categoria nao passada"}:ButtonCategoriaProps) => {
    return (
        <>
            <div className="alex-category">
                    {nomeCategoria}
            </div>

        </>


    )
}
export default ButtonCategoria;