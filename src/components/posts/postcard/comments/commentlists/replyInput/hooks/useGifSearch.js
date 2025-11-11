import { useState } from "react";

const GIPHY_API_KEY = "VVIh3PWRWOXsgeVtuL3376msP82wyU61";

export const useGifSearch = () => {
  const [gifs, setGifs] = useState([]);
  const [gifSearch, setGifSearch] = useState("");

  const handleGifSearch = async (query) => {
    setGifSearch(query);
    if (!query.trim()) return setGifs([]);
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(
          query
        )}&limit=15&rating=g`
      );
      const data = await res.json();
      setGifs(data.data);
    } catch (err) {
      console.error("Error fetching GIFs:", err);
    }
  };

  return { gifs, gifSearch, handleGifSearch, setGifs };
};
