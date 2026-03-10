import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../redux/slices/favoritesSlice";
import { getPosterUrl } from "../../services/tmdb";
import toast from "react-hot-toast";

export default function MovieCard({
  item,
  mediaType = "movie",
  showType = false,
}) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: favorites } = useSelector((s) => s.favorites);

  const type = item.media_type || mediaType;
  const title = item.title || item.name || "Unknown Title";
  const date = item.release_date || item.first_air_date || "";
  const year = date ? new Date(date).getFullYear() : "";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const poster = getPosterUrl(
    type === "person" ? item.profile_path : item.poster_path,
  );
  const isFav = favorites.some((f) => f.tmdbId === String(item.id));

  const handleClick = () => {
    const path =
      type === "tv"
        ? `/tv/${item.id}`
        : type === "person"
          ? `/person/${item.id}`
          : `/movie/${item.id}`;
    navigate(path);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }
    if (isFav) {
      dispatch(removeFavorite(String(item.id)));
      toast.success("Removed from favorites");
    } else {
      dispatch(
        addFavorite({
          tmdbId: String(item.id),
          mediaType: type,
          title,
          posterPath: item.poster_path || "",
          releaseDate: date,
          rating: item.vote_average || 0,
          overview: item.overview || "",
        }),
      );
      toast.success("Added to favorites ❤️");
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: 10,
        overflow: "hidden",
        background: "var(--bg-card)",
        transform: hovered
          ? "translateY(-6px) scale(1.02)"
          : "translateY(0) scale(1)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered
          ? "0 20px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(229,9,20,0.2)"
          : "var(--shadow-card)",
      }}
    >
      {/* Poster Image */}
      <div
        style={{
          position: "relative",
          aspectRatio: "2/3",
          background: "var(--bg-secondary)",
        }}
      >
        {!imgError ? (
          <img
            src={poster}
            alt={title}
            onError={() => setImgError(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              color: "rgba(255,255,255,0.3)",
              fontSize: 13,
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>🎬</span>
            <span
              style={{ textAlign: "center", padding: "0 8px", lineHeight: 1.3 }}
            >
              {title}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
          }}
        />

        {/* Type badge */}
        {showType && type && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background:
                type === "tv"
                  ? "rgba(245,197,24,0.9)"
                  : type === "person"
                    ? "rgba(100,180,255,0.9)"
                    : "rgba(229,9,20,0.9)",
              color: "white",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {type === "tv" ? "TV" : type === "person" ? "Person" : "Movie"}
          </div>
        )}

        {/* Rating */}
        {rating && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "rgba(0,0,0,0.8)",
              borderRadius: 6,
              padding: "3px 7px",
              fontSize: 12,
              fontWeight: 700,
              color:
                parseFloat(rating) >= 7 ? "#f5c518" : "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              gap: 3,
              backdropFilter: "blur(4px)",
            }}
          >
            ★ {rating}
          </div>
        )}

        {/* Favorite button */}
        {type !== "person" && (
          <button
            onClick={handleFavorite}
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: isFav ? "rgba(229,9,20,0.9)" : "rgba(0,0,0,0.7)",
              border: `1px solid ${isFav ? "rgba(229,9,20,0.5)" : "rgba(255,255,255,0.2)"}`,
              color: "white",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "scale(1)" : "scale(0.8)",
              transition: "all 0.2s",
              backdropFilter: "blur(4px)",
            }}
          >
            {isFav ? "❤️" : "🤍"}
          </button>
        )}

        {/* Play button on hover */}
        {type !== "person" && hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(229,9,20,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 20px rgba(229,9,20,0.5)",
                animation: "fadeIn 0.2s ease",
              }}
            >
              ▶
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        {year && (
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{year}</div>
        )}
        {type === "person" && item.known_for_department && (
          <div
            style={{
              fontSize: 11,
              color: "var(--accent)",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {item.known_for_department}
          </div>
        )}
      </div>
    </div>
  );
}
