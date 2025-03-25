interface ILimpar{
    onClickHandle:()=> void
    title:string
}

const Limpar=({onClickHandle,title}:ILimpar)=>{
    return(
        <>
        <div className="alex-btn alex-btn-white" onClick={onClickHandle}>
            {title}
          </div>
        </>
    )
}
export {Limpar}