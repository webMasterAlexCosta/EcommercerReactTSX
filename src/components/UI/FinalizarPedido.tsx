interface IFinalizarPedido{
    title: string;
   // enviar: () => void;
    clickpedido: () => void;    
}

const FinalizarPedido = ({title  , clickpedido} : IFinalizarPedido) => {
    return (
        <>
            <div className="dsc-btn dsc-btn-blue" onClick={() => {  clickpedido(); }}>{title}</div>
        </>
    )
}
export  {FinalizarPedido}