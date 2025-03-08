import { Link } from "react-router-dom"
 
interface IContinuarComprando{
    link:string
    title:string
    className?: string;
}
const ContinuarComprando=({link,title,className="dsc-btn dsc-btn-white"}:IContinuarComprando)=>{
    return(
        <>
        <Link to={link}>
              <div className={className}>{title}</div>
            </Link>
        </>
    )
}
export {ContinuarComprando}