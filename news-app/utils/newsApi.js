const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

export async function fetchNews({
  page = 1,
  category = "general",
  pageSize = 10,
}) {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("News API Error:", error);
    throw error;
  }
}
