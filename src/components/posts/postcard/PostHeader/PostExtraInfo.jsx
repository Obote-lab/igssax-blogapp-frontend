import React from "react";
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap } from "react-icons/fa";

function PostExtraInfo({ author }) {
  if (!author?.profile) return null;

  return (
    <div
      className="mt-1 small text-muted"
      style={{ transition: "opacity 0.3s ease" }}
    >
      {author.profile.location && (
        <div className="d-flex align-items-center gap-1">
          <FaMapMarkerAlt size={10} /> {author.profile.location}
        </div>
      )}
      {author.profile.work && (
        <div className="d-flex align-items-center gap-1">
          <FaBriefcase size={10} /> {author.profile.work}
        </div>
      )}
      {author.profile.education && (
        <div className="d-flex align-items-center gap-1">
          <FaGraduationCap size={10} /> {author.profile.education}
        </div>
      )}
    </div>
  );
}

export default PostExtraInfo;
