interface ButtonActiosProps {
    className?: string,
    nome: string
}
const ButtonActios = (props: ButtonActiosProps) => {

    return (
        <button className={props.className}>
            {props.nome}
        </button>
    );
};
export default ButtonActios;