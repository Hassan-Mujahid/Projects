"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Skeleton,
  Box,
  Chip,
} from "@mui/material";
import { useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function NewsCard({ article }) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
        },
      }}
    >
      {article.urlToImage && !imageError ? (
        <CardMedia
          component="img"
          height="200"
          image={article.urlToImage}
          alt={article.title}
          onError={() => setImageError(true)}
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Skeleton variant="rectangular" height={200} />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {article.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            mb: 2,
          }}
        >
          {article.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <AccessTimeIcon fontSize="small" />
          <Typography variant="caption">
            {formatDate(article.publishedAt)}
          </Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More
        </Button>
      </CardActions>
    </Card>
  );
}
