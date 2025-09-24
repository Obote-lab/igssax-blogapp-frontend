function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
      <div className="p-5 rounded shadow-lg bg-white">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <p className="fs-4 text-muted mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <a href="/dashboard" className="btn btn-outline-primary btn-lg">
          <i className="bi bi-arrow-left-circle me-2"></i>
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

export default NotFound;
