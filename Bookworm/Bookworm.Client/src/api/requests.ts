import axios, { AxiosError, type AxiosResponse } from "axios";
import { store } from "../store/store";
import { toast } from "react-toastify";
import { router } from "../router/Router";

axios.defaults.baseURL = "http://localhost:5141/api/";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(requests => {
    const token = store.getState().account.user?.token;
    if (token)
        requests.headers.Authorization = `Bearer ${token}`;
    return requests;
})

axios.interceptors.response.use(response => {
    return response;
}, (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch(status)
    {
        case 400:
            if(data.errors) {
                const modelErrors : string[] = [];

                for(const key in data.errors) {
                    modelErrors.push(data.errors[key]);
                }

                throw modelErrors;
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 404:
            router.navigate("/not-found");
            break;
        case 500:
            router.navigate("/server-error", { state: { error: data, status: status } });
            break;
        default:
            break;

    }
    return Promise.reject(error.response);
})

const queries = {
    get: (url: string) => axios.get(url).then((response: AxiosResponse) => response.data),
    post: (url: string, body: {}) => axios.post(url, body).then((response: AxiosResponse) => response.data),
    put: (url: string, body: {}) => axios.put(url, body).then((response: AxiosResponse) => response.data),
    delete: (url: string) => axios.delete(url).then((response: AxiosResponse) => response.data)
}

const Book = {
    list: () => queries.get("book"),
    details: (id: number) => queries.get(`book/${id}`),
    create: (formData: any) => queries.post("book", formData),
    update: (formData: any) => queries.put(`book/${formData.id}`, formData),
    delete: (id: number) => queries.delete(`book/${id}`)
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
    today: () => queries.get("/order/today"),
    pending: () => queries.get("/order/pending-orders")
}

const Author = {
    list:()=>queries.get("author"),
    details: (id: number) => queries.get(`author/${id}`)
}

const Comment = {
    listByBook: (bookId: number) => queries.get(`comment/book/${bookId}`),
    add: (content: string, bookId: number) => queries.post("comment", { content, bookId }),
    update: (id: number, content: string) => queries.put(`comment/${id}`, { content }),
    delete: (id: number) => queries.delete(`comment/${id}`)
}

const requests = {
    Book,
    Cart,
    Category,
    Account,
    Order,
    Author,
    Comment
}
export default requests 



