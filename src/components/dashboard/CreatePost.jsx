import { useState, useRef } from "react";
import { postsAPI } from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import PostHeader from "../postcreation/PostHeader";
import PostInput from "../postcreation/PostInput";
import MediaPreview from "../postcreation/MediaPreview";
import TagsInput from "../postcreation/TagsInput";
import QuickActions from "../postcreation/QuickActions";
import ExpandedOptions from "../postcreation/ExpandedOptions";
import SubmitButton from "../postcreation/SubmitButton";
import "./CreatePost.css";

function CreatePost({ onPostCreated }) {
  const { currentUser } = useAuth();
  const [post, setPost] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handlePost = async () => {
    if (!post.trim() && mediaFiles.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();

      if (post.trim()) {
        formData.append("content", post);
      }

      formData.append("privacy", privacy);

      mediaFiles.forEach((file) => {
        formData.append(`media_files`, file);
      });

      if (tags.length > 0) {
        formData.append("tag_names", JSON.stringify(tags));
      }

      await postsAPI.createPost(formData);

      // Reset form
      setPost("");
      setMediaFiles([]);
      setTags([]);
      setShowOptions(false);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        "Error creating post: " +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    setMediaFiles((prev) => [...prev, ...validFiles]);
    event.target.value = "";
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = (tagText) => {
    if (tagText.trim() && !tags.includes(tagText.trim().toLowerCase())) {
      setTags((prev) => [...prev, tagText.trim().toLowerCase()]);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="card create-post-card border-0 shadow-sm">
      <div className="card-body p-4">
        {/* Header with User Info & Privacy */}
        <PostHeader
          user={currentUser}
          privacy={privacy}
          setPrivacy={setPrivacy}
          loading={loading}
        />

        {/* Text Input */}
        <PostInput
          user={currentUser}
          post={post}
          setPost={setPost}
          loading={loading}
        />

        {/* Media Preview */}
        <MediaPreview mediaFiles={mediaFiles} onRemoveMedia={removeMedia} />

        {/* Tags */}
        <TagsInput tags={tags} onRemoveTag={removeTag} />

        {/* Quick Action Buttons */}
        <QuickActions
          onShowOptions={() => setShowOptions(true)}
          onImageUpload={() => imageInputRef.current?.click()}
          loading={loading}
        />

        {/* Expanded Options */}
        {showOptions && (
          <ExpandedOptions
            tags={tags}
            onAddTag={addTag}
            onRemoveTag={removeTag}
            mediaFiles={mediaFiles}
            onImageUpload={() => imageInputRef.current?.click()}
            onVideoUpload={() => videoInputRef.current?.click()}
            loading={loading}
            onClose={() => setShowOptions(false)}
          />
        )}

        {/* Submit Button */}
        <SubmitButton
          post={post}
          mediaFiles={mediaFiles}
          loading={loading}
          onPost={handlePost}
        />
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleMediaUpload}
        ref={fileInputRef}
        className="d-none"
        disabled={loading}
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleMediaUpload}
        ref={imageInputRef}
        className="d-none"
        disabled={loading}
      />
      <input
        type="file"
        multiple
        accept="video/*"
        onChange={handleMediaUpload}
        ref={videoInputRef}
        className="d-none"
        disabled={loading}
      />
    </div>
  );
}

export default CreatePost;
