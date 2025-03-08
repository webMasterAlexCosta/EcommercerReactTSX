interface ICarregandoProdutos {
    title: string
    className?: string
}

const CarregandoProdutos = ({ title, className }: ICarregandoProdutos) => {
    return (
        <>
            {!className ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>{title}</p>
                </div>
            ) : (
                <p className={className}>{title}</p>
            )}
        </>
    )
}

export { CarregandoProdutos }
