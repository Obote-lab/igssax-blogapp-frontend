// import { useState, useEffect } from "react";
// import { FaThumbsUp, FaComment, FaShare, FaUserCircle } from "react-icons/fa";
// import { commentsAPI, reactionsAPI } from "../../api/axios";

// function PostCard({ post }) {
//   const { id, author, content, privacy, created_at, media, tags } = post;

//   // ---------------- STATE ----------------
//   const [comments, setComments] = useState([]);
//   const [showComments, setShowComments] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [reactions, setReactions] = useState([]);
//   const [hasLiked, setHasLiked] = useState(false);

//   // ---------------- HELPERS ----------------
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return (
//       date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//       }) +
//       " " +
//       date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     );
//   };

//   // ---------------- COMMENTS ----------------
//   const fetchComments = async () => {
//     try {
//       const { data } = await commentsAPI.getComments(id);
//       setComments(data);
//     } catch (err) {
//       console.error("Failed to fetch comments:", err);
//     }
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;
//     try {
//       await commentsAPI.createComment({ post: id, content: newComment });
//       setNewComment("");
//       fetchComments(); // refresh comments
//     } catch (err) {
//       console.error("Failed to add comment:", err);
//     }
//   };

//   // ---------------- REACTIONS ----------------
//   const fetchReactions = async () => {
//     try {
//       const { data } = await reactionsAPI.getPostReactions(id);
//       setReactions(data);
//       // check if current user liked
//       const userId = localStorage.getItem("userId"); // store this on login
//       setHasLiked(data.some((r) => r.user === parseInt(userId)));
//     } catch (err) {
//       console.error("Failed to fetch reactions:", err);
//     }
//   };

//   const handleToggleLike = async () => {
//     try {
//       if (hasLiked) {
//         // find current user's reaction
//         const myReaction = reactions.find(
//           (r) => r.user === parseInt(localStorage.getItem("userId"))
//         );
//         if (myReaction) await reactionsAPI.removeReaction(myReaction.id);
//       } else {
//         await reactionsAPI.addReaction({ type: "like", post: id });
//       }
//       fetchReactions(); // refresh
//     } catch (err) {
//       console.error("Failed to toggle like:", err);
//     }
//   };

//   // ---------------- EFFECTS ----------------
//   useEffect(() => {
//     fetchReactions();
//   }, []);

//   // ---------------- RENDER ----------------
//   return (
//     <div className="card shadow-sm mb-4 rounded-4">
//       <div className="card-body">
//         {/* User Header */}
//         <div className="d-flex align-items-center justify-content-between mb-3">
//           <div className="d-flex align-items-center">
//             {author?.profile_picture ? (
//               <img
//                 src={author.profile_picture}
//                 alt={author.first_name}
//                 className="rounded-circle me-2"
//                 width={40}
//                 height={40}
//               />
//             ) : (
//               <FaUserCircle size={40} className="text-muted me-2" />
//             )}
//             <div>
//               <strong className="d-block">
//                 {author?.first_name} {author?.last_name}
//               </strong>
//               <small className="text-muted">{formatDate(created_at)}</small>
//               {privacy && (
//                 <small className="badge bg-secondary ms-2">{privacy}</small>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         {content && <p className="mb-3">{content}</p>}

//         {/* Tags */}
//         {tags && tags.length > 0 && (
//           <div className="mb-3">
//             {tags.map((tag) => (
//               <span key={tag.id} className="badge bg-primary me-1">
//                 #{tag.name}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Media */}
//         {media && media.length > 0 && (
//           <div className="mb-3">
//             {media.map((mediaItem) =>
//               mediaItem.media_type === "video" ? (
//                 <video
//                   key={mediaItem.id}
//                   controls
//                   className="w-100 rounded mb-2"
//                   style={{ maxHeight: "450px", objectFit: "cover" }}
//                 >
//                   <source src={mediaItem.file} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <img
//                   key={mediaItem.id}
//                   src={mediaItem.file}
//                   alt="post media"
//                   className="img-fluid rounded mb-2"
//                   style={{
//                     maxHeight: "450px",
//                     objectFit: "cover",
//                     width: "100%",
//                   }}
//                 />
//               )
//             )}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="d-flex justify-content-around text-muted border-top pt-3">
//           <button
//             className="btn btn-light d-flex align-items-center gap-2 flex-fill justify-content-center"
//             onClick={handleToggleLike}
//           >
//             <FaThumbsUp color={hasLiked ? "blue" : "gray"} />{" "}
//             {hasLiked ? "Liked" : "Like"} ({reactions.length})
//           </button>
//           <button
//             className="btn btn-light d-flex align-items-center gap-2 flex-fill justify-content-center"
//             onClick={() => {
//               setShowComments(!showComments);
//               if (!showComments) fetchComments();
//             }}
//           >
//             <FaComment /> Comment ({comments.length})
//           </button>
//           <button className="btn btn-light d-flex align-items-center gap-2 flex-fill justify-content-center">
//             <FaShare /> Share
//           </button>
//         </div>

//         {/* Comments Section */}
//         {showComments && (
//           <div className="mt-3 border-top pt-3">
//             {comments.length === 0 ? (
//               <p className="text-muted">No comments yet.</p>
//             ) : (
//               comments.map((c) => (
//                 <div key={c.id} className="mb-2">
//                   <strong>{c.author}</strong>
//                   <p className="mb-1">{c.content}</p>
//                   <small className="text-muted">
//                     {formatDate(c.created_at)}
//                   </small>
//                 </div>
//               ))
//             )}

//             {/* Add Comment */}
//             <div className="d-flex mt-2">
//               <input
//                 type="text"
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 className="form-control me-2"
//                 placeholder="Write a comment..."
//               />
//               <button className="btn btn-primary" onClick={handleAddComment}>
//                 Post
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PostCard;
