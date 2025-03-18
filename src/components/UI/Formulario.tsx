interface IFormulario {
    className: string;
    label: string;
    htmlFor:string
    type: string;
    id: string;
    value: string | number;
    readOnly : boolean
}

const FormularioUser = ({ className, label, htmlFor,type, id, value,readOnly }: IFormulario) => {
    return (
        <>
            <div className={className}>
                <label htmlFor={htmlFor}>{label}</label>
                <input type={type} id={id} value={value} readOnly={readOnly} />
            </div>
        </>
    )
}
export { FormularioUser }