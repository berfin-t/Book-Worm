import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { IAuthor } from "../../model/IAuthor";
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

interface Props {
    author: IAuthor
}

export default function Author({ author }: Props) {  
const baseUrl = "http://localhost:5141";

     return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        gap: 2
      }}
    >      
      <CardMedia
        component="img"
        image={baseUrl + author.imgUrl}
        alt={author.name}
        sx={{
          width: 120,
          height: 160,
          objectFit: "contain",
          borderRadius: 2
        }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" gutterBottom>
          {author.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {author.bio}
        </Typography>

        <Button
          component={Link}
          to={`/author/${author.id}`}
          variant="outlined"
          size="small"
          sx={{ mt: 2 }}
          startIcon={<SearchIcon />}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
}