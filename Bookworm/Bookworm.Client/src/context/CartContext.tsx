// import { createContext, useState, useContext, type PropsWithChildren } from "react";
// import type { ICart } from "../model/ICart";

// interface CartContextValue {
//     cart: ICart | null;
//     setCart: (cart: ICart) => void;
//     deleteItem: (bookId: number, quantity: number) => void;
// }

// export const CartContext = createContext<CartContextValue | undefined>(undefined);

// export function useCartContext() {
//     const context = useContext(CartContext);
//     if (context === undefined) {
//         throw new Error("no provider");
//     }
//     return context;
// }

// export function CartContextProvider({ children }: PropsWithChildren<any>) {
//     const [cart, setCart] = useState<ICart | null>(null);

//     function deleteItem(bookId: number, quantity: number) {

//     }
//     return (
//         <CartContext.Provider value={{ cart, setCart, deleteItem }}>
//             {children}
//         </CartContext.Provider>
//     );
// }