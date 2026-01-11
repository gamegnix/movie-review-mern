function StarRating({ rating = 0 }) {
  const safeRating = Math.max(0, Math.min(5, rating));

  return (
    <div style={{ color: "#f5c518", fontSize: "18px" }}>
      {"★".repeat(safeRating)}
      {"☆".repeat(5 - safeRating)}
    </div>
  );
}

export default StarRating;
