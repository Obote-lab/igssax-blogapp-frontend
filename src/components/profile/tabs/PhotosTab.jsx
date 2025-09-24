// src/components/profile/tabs/PhotosTab.jsx
function PhotosTab({ userId }) {
  // Placeholder data, replace with API call (fetch user media)
  const photos = [
    "https://via.placeholder.com/200x200?text=Photo+1",
    "https://via.placeholder.com/200x200?text=Photo+2",
    "https://via.placeholder.com/200x200?text=Photo+3",
    "https://via.placeholder.com/200x200?text=Photo+4",
  ];

  if (photos.length === 0) {
    return <p className="text-center text-muted">No photos yet.</p>;
  }

  return (
    <div className="photos-tab">
      <h5 className="fw-bold mb-3">Photos</h5>
      <div className="row g-2">
        {photos.map((url, i) => (
          <div key={i} className="col-6 col-md-4 col-lg-3">
            <img
              src={url}
              alt={`Photo ${i}`}
              className="img-fluid rounded shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotosTab;
