interface IFinalizarPedido{
    title:string
}

const FinalizarPedido = ({title} : IFinalizarPedido) => {
    return (
        <>
    <div className="dsc-btn dsc-btn-blue">{title}</div>
        </>
    )
}
export  {FinalizarPedido}