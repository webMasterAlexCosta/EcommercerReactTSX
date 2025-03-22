import React from "react";

interface IFormulario {
    className: string;
    label: string;
    htmlFor: string;
    type: string;
    name?: string
    id: string;
    value: string | number;
    readOnly?: boolean;
    icon?: React.ReactElement;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    maxLength?: number
    minLength?: number
    required?: boolean
}

const FormularioUser = ({ className, label, htmlFor, type, id, value, readOnly, icon, name, onChange, minLength, maxLength, required }: IFormulario) => {
    return (
        <div className={className}>
            <label htmlFor={htmlFor}>
                {icon && <span className="icon">{icon}</span>}
                {label}
            </label>
            <input type={type} name={name} id={id} value={value} readOnly={readOnly}
                onChange={onChange} minLength={minLength} maxLength={maxLength} required={required} />
        </div>
    );
}

export { FormularioUser };
