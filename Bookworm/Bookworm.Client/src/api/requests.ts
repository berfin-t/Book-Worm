import axios, { type AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5141/api/";
//axios.defaults.withCredentials = true;

const queries = {
    get: (url: string) => axios.get(url).then((response: AxiosResponse) => response.data),
    post: (url: string, body: {}) => axios.post(url, body).then((response: AxiosResponse) => response.data),
    put: (url: string, body: {}) => axios.put(url, body).then((response: AxiosResponse) => response.data),
    delete: (url: string) => axios.delete(url).then((response: AxiosResponse) => response.data),
}

const Catalog = {
    list: () => queries.get("book"),
    details: (id: number) => queries.get(`books/${id}`)
}

const Cart = {
    get: queries.get("cart"),
    addItem: (bookId: number, quantity = 1) => queries.post(`cart?bookId=${bookId}&quantity=${quantity}`, {}),
    deleteItem: (bookId: number, quantity = 1) => queries.delete(`cart?bookId=${bookId}&quantity=${quantity}`)
}

const requests = {
    Catalog, Cart
}
export default requests 



