export interface IOrder {
    id: number
    status: string
    orderDate: string
    orderStatus: number
    orderItems: IOrderItem[]
    subTotal: number
    firstName: string
    lastName: string
    phone: string
    addresLine: string
    city: string
}

export interface IOrderItem {
    id: number
    bookId: number
    bookName: string
    bookImage: string
    price: number
    quantity: number
}