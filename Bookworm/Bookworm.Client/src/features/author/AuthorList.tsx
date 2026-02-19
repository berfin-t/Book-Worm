import { Box } from "@mui/material";
import type { IAuthor } from "../../model/IAuthor";
import Author from "./Author";

interface Props {
    author: IAuthor[];
}

export default function AuthorList({author}: Props) {

    if(!author || author.length===0) return null;

    return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 4 }}>
      {author.map((a) => (
        <Author key={a.id} author={a} />
      ))}
    </Box>
  );
}