
export interface ICartItem {
    bookId: number,
    name: string,
    price: number,
    quantity: number,
    imgUrl: string

}
export interface ICart {
    cartId: string,
    customerId: string,
    cartItems: ICartItem[];
}