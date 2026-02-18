export interface IBook{
    id: number;
    title: string;
    isbn: string;
    price: number;
    stock: number;
    description: string;
    isActive: boolean;
    imgUrl: string;
    authorName: string;   
    categoryName: string;
}