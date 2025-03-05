import "../Layout/HeaderClient/Styles.css"
import cart from '../../assets/images/cart.svg';
import { useContext } from "react";

import ContextCartCount from "../../data/CartCountContext";

const CartIcon = () => {
    const { contextCartCount } = useContext(ContextCartCount)


    console.log(contextCartCount)

    return (
        <>
            <img src={cart} alt="Carrinho de compras" />
            {contextCartCount > 0 && (
                <div className="number">{contextCartCount}
                </div>
            )}
        </>
    )
}
export { CartIcon }