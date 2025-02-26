interface ButtonActiosProps {
    className?: string,
    nome: string
    onNewValue?: () => void
}
const ButtonActios = (props: ButtonActiosProps) => {

    return (
        <button className={props.className} onClick={props.onNewValue}>
            {props.nome}
        </button>
    );
};
export default ButtonActios;