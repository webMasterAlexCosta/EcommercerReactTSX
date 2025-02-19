interface ButtonCategoriaProps {
    nomeCategoria?: string ;  
}

const ButtonCategoria = ({nomeCategoria = "Categoria nao passada"}:ButtonCategoriaProps) => {
    return (
        <>
            <div className="dsc-category">
                    {nomeCategoria}
            </div>

        </>


    )
}
export default ButtonCategoria;