import type { IBook } from "./IBook";

export interface IAuthor {
    id: number;
    name: string;
    bio:string;
    imgUrl: string;
    books?: IBook[];
}