import axios, { type AxiosResponse } from "axios";
import { store } from "../store/store";

axios.defaults.baseURL = "http://localhost:5141/api/";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(requests => {
    const token = store.getState().account.user?.token;
    if (token)
        requests.headers.Authorization = `Bearer ${token}`;
    return requests;
})

const queries = {
    get: (url: string) => axios.get(url).then((response: AxiosResponse) => response.data),
    post: (url: string, body: {}) => axios.post(url, body).then((response: AxiosResponse) => response.data),
    put: (url: string, body: {}) => axios.put(url, body).then((response: AxiosResponse) => response.data),
    delete: (url: string) => axios.delete(url).then((response: AxiosResponse) => response.data),
}

const Book = {
    list: () => queries.get("book"),
    details: (id: number) => queries.get(`book/${id}`),
    create: (formData: any) => queries.post("book", formData)
}

const Cart = {
    get: () => queries.get("cart"),
    addItem: (bookId: number, quantity = 1) => queries.post(`cart?bookId=${bookId}&quantity=${quantity}`, {}),
    deleteItem: (bookId: number, quantity = 1) => queries.delete(`cart?bookId=${bookId}&quantity=${quantity}`)
}

const Category = {
    list:() => queries.get("category"),
    details: (id: number) => queries.get(`category/${id}`),
    getCategoryWithCount: () => queries.get("category/with-count")
}

const Account = {
    login: (values: any) => queries.post("account/login", values),
    register: (values: any) => queries.post("account/register", values),
    getUser: () => queries.get("account/getUser")
}

const Order = {
    list: () => queries.get("order"),
    listByAdmin: () => queries.get("order/get-by-admin"),
    get: (id:number) => queries.get(`order/${id}`),
    create:(formData:any) => queries.post("order", formData),
    count: () => queries.get("/order/count"),
    today: () => queries.get("/order/today")
}

const Author = {
    list:()=>queries.get("author"),
    details: (id: number) => queries.get(`author/${id}`)
}

const requests = {
    Book,
    Cart,
    Category,
    Account,
    Order,
    Author
}
export default requests 



