interface IFinalizarPedido{
    title: string;
    enviar: () => void;
}

const FinalizarPedido = ({title , enviar} : IFinalizarPedido) => {
    return (
        <>
    <div className="dsc-btn dsc-btn-blue" onClick={enviar}>{title}</div>
        </>
    )
}
export  {FinalizarPedido}