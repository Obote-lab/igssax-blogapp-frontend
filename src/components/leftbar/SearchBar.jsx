import { useState } from "react";

const SearchBar = ({ onSearch, themeColor }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search IGSSAX..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            borderColor: query ? themeColor : "var(--border-color)",
          }}
        />
      </form>
    </div>
  );
};

export default SearchBar;
