import type { IBook } from "./IBook";

export interface ICategory {
    id: number;
    name: string;
    bookCount: number;
    books:IBook[];
}