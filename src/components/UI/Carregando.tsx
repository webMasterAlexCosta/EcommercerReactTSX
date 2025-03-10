interface ICarregando {
    title: string
    className?: string
}

const Carregando = ({ title, className }: ICarregando) => {
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

export { Carregando }
