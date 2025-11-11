import { useState, useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { FaSort, FaCaretDown } from "react-icons/fa";
import CommentItem from "./CommentItem";
import "./CommentsLists.css";
import { useTheme } from "../../../../../ThemeContext";

function CommentsList({
  comments = [],
  isLoading = false,
  formatDate,
  currentUser,
  onLoadMore,
  handleAddComment,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || theme === "dark-mode";
  const [sortBy, setSortBy] = useState("newest");
  const [expandedReplies, setExpandedReplies] = useState({});

  // Only top-level comments, sorted
  const processedComments = useMemo(() => {
    const topLevel = comments.filter((c) => !c.parent);
    return [...topLevel].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "most_replies":
          return (b.replies?.length || 0) - (a.replies?.length || 0);
        default:
          return 0;
      }
    });
  }, [comments, sortBy]);

  const toggleReplies = (id) => {
    setExpandedReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAllReplies = () => {
    const allExpanded = {};
    const expandAll = (list, depth = 0) => {
      if (depth >= 4) return;
      list.forEach((c) => {
        if (c.replies?.length) {
          allExpanded[c.id] = true;
          expandAll(c.replies, depth + 1);
        }
      });
    };
    expandAll(processedComments);
    setExpandedReplies(allExpanded);
  };

  const collapseAllReplies = () => setExpandedReplies({});

  // Count including replies
  const totalCommentCount = useMemo(() => {
    const count = (list) =>
      list.reduce((acc, c) => acc + 1 + (c.replies ? count(c.replies) : 0), 0);
    return count(processedComments);
  }, [processedComments]);

  const sortOptions = [
    { value: "newest", label: "Most recent" },
    { value: "oldest", label: "Oldest" },
    { value: "most_replies", label: "Most replies" },
  ];

  if (isLoading) {
    return (
      <div
        className={`card ${
          isDark ? "bg-dark text-light" : "bg-white"
        } border-0`}
      >
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" /> Loading comments...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card ${
        isDark ? "bg-dark text-light" : "bg-white text-dark"
      } border-0 rounded-0`}
    >
      {/* Header */}
      <div
        className={`comment-count-header d-flex justify-content-between align-items-center px-3 py-2 ${
          isDark ? "border-secondary" : "border-light"
        }`}
      >
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">
            Comments • {totalCommentCount}
            <small className="text-muted ms-1">
              ({processedComments.length} threads)
            </small>
          </span>
          {processedComments.some((c) => c.replies?.length) && (
            <div className="d-flex gap-2">
              <button
                className={`btn btn-sm ${
                  isDark ? "btn-outline-light" : "btn-outline-dark"
                }`}
                onClick={expandAllReplies}
              >
                Expand All
              </button>
              <button
                className={`btn btn-sm ${
                  isDark ? "btn-outline-light" : "btn-outline-dark"
                }`}
                onClick={collapseAllReplies}
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        <Dropdown>
          <Dropdown.Toggle
            variant="link"
            className={`p-0 ${isDark ? "text-light" : "text-dark"}`}
            id="sort-dropdown"
          >
            <FaSort size={12} className="me-1" />
            Sort
            <FaCaretDown size={10} className="ms-1" />
          </Dropdown.Toggle>
          <Dropdown.Menu
            className={isDark ? "bg-dark border-secondary" : ""}
            align="end"
          >
            {sortOptions.map((opt) => (
              <Dropdown.Item
                key={opt.value}
                active={sortBy === opt.value}
                onClick={() => setSortBy(opt.value)}
                className={isDark ? "text-light bg-dark" : ""}
              >
                {opt.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Comments */}
      <div className="comments-list p-3">
        {processedComments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No comments yet</p>
            <small>Be the first to comment!</small>
          </div>
        ) : (
          processedComments.map((comment) => (
            <div
              key={comment.id}
              className={`comment-card mb-3 p-3 rounded ${
                isDark ? "bg-secondary text-light" : "bg-light text-dark"
              }`}
            >
              <CommentItem
                comment={comment}
                depth={0}
                formatDate={formatDate}
                currentUser={currentUser}
                expandedReplies={expandedReplies}
                toggleReplies={toggleReplies}
                handleAddComment={handleAddComment}
              />
            </div>
          ))
        )}
      </div>

      {onLoadMore && processedComments.length > 0 && (
        <div
          className={`text-center py-2 border-top ${
            isDark ? "border-secondary" : "border-light"
          }`}
        >
          <button
            className={`btn btn-link ${
              isDark ? "text-light" : "text-dark"
            } small`}
            onClick={onLoadMore}
          >
            Load more comments
          </button>
        </div>
      )}
    </div>
  );
}

export default CommentsList;
