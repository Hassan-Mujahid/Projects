"use client";

import { useState, useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  Fade,
  Alert,
} from "@mui/material";
import NewsCard from "../../../components/NewsCard";
import SearchBar from "../../../components/SearchBar";
import CategoryFilter from "../../../components/CategoryFilter";
import NewsFilters from "../../../components/NewsFilters";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNews } from "../../../custom/useNews";

export default function NewsDashboard() {
  const [filters, setFilters] = useState({
    page: 1,
    searchQuery: "",
    category: "all",
    sortBy: "publishedAt_desc",
    fromDate: null,
    toDate: null,
  });
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [news, setNews] = useState([]);

  const {
    news: newsData,
    totalResults,
    isLoading,
    isError,
    isEverythingEndpoint,
  } = useNews(filters);

  useEffect(() => {
    if (newsData) {
      setNews(newsData);
    }
  }, [newsData]);

  const handleSearch = useCallback((query) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
      page: 1, // Reset to first page
      category: "all",
    }));
  }, []);

  const handleCategoryChange = (newCategory) => {
    setFilters((prev) => ({
      ...prev,
      category: newCategory,
      page: 1,
      // Clear date filters when switching to top-headlines
      ...(newCategory !== "all" && {
        fromDate: null,
        toDate: null,
      }),
    }));
  };

  const handleSortChange = (newSortBy) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: newSortBy,
      page: 1,
    }));
  };

  const handleDateChange = (type) => (dateString) => {
    setFilters((prev) => ({
      ...prev,
      [type]: dateString,
      page: 1,
      // When setting dates, switch to 'all' category
      category: "all",
    }));
  };

  // Update hasMore based on totalResults
  useEffect(() => {
    setHasMore(news.length < totalResults);
  }, [news.length, totalResults]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && news.length < totalResults) {
      setIsLoadingMore(true);
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [isLoadingMore, news.length, totalResults]);

  // Reset states when filters change
  useEffect(() => {
    setHasMore(true);
    setIsLoadingMore(false);
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [
    filters.category,
    filters.searchQuery,
    filters.sortBy,
    filters.fromDate,
    filters.toDate,
  ]);

  // Reset isLoadingMore when new data is loaded
  useEffect(() => {
    setIsLoadingMore(false);
  }, [news]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Latest News
        </Typography>

        <SearchBar onSearch={handleSearch} />

        {!isEverythingEndpoint && (
          <CategoryFilter
            value={filters.category}
            onChange={handleCategoryChange}
          />
        )}

        <NewsFilters
          sortBy={filters.sortBy}
          onSortChange={handleSortChange}
          fromDate={filters.fromDate}
          onFromDateChange={handleDateChange("fromDate")}
          toDate={filters.toDate}
          onToDateChange={handleDateChange("toDate")}
          disabled={!isEverythingEndpoint}
        />

        {isEverythingEndpoint && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Using advanced search with date filters.
            {filters.category !== "all" &&
              " Category is included in search terms."}
          </Alert>
        )}
      </Box>

      <Fade in={true}>
        <div>
          <>
            {isLoading && news.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <InfiniteScroll
                  dataLength={news.length}
                  next={loadMore}
                  hasMore={!isError && hasMore}
                  loader={
                    isLoadingMore && hasMore ? (
                      <Box
                        sx={{ display: "flex", justifyContent: "center", p: 3 }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mt: 4 }}
                      >
                        No more news to load.
                      </Typography>
                    )
                  }
                  endMessage={
                    news.length > 0 && (!hasMore || isError) ? (
                      <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ mt: 4 }}
                      >
                        No more news to load.
                      </Typography>
                    ) : null
                  }
                  style={{ overflow: "visible" }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: 3,
                      width: "100%",
                      "& > *": {
                        minWidth: 0,
                      },
                    }}
                  >
                    {news.map((article, index) => (
                      <Box key={`${article.url}-${index}`}>
                        <NewsCard article={article} />
                      </Box>
                    ))}
                  </Box>
                </InfiniteScroll>

                {isError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {isError.message ===
                    "Requests from the browser are not allowed on the Developer plan, except from localhost."
                      ? "No more articles can be loaded. This is a free plan limitation that only allows requests while developing."
                      : isError.message}
                  </Alert>
                )}
              </>
            )}

            {!isLoading && news.length === 0 && (
              <Alert severity="info">
                No news found. Try different filters.
              </Alert>
            )}
          </>
        </div>
      </Fade>
    </Container>
  );
}
