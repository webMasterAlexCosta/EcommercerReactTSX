interface ILimpar{
    onClickHandle:()=> void
    title:string
}

const Limpar=({onClickHandle,title}:ILimpar)=>{
    return(
        <>
        <div className="dsc-btn dsc-btn-white" onClick={onClickHandle}>
            {title}
          </div>
        </>
    )
}
export {Limpar}