export interface IBook{
    id: number;
    title: string;
    author: string;
    isbn: string;
    price: number;
    stock: number;
    description: string;
    isActive: boolean;
    imgUrl: string;
    categoryId: number;
}