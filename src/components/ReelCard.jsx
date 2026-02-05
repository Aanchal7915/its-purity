import React, { useMemo, useState, useEffect } from "react";
import { Heart, Share2, Play, Volume2, VolumeX } from "lucide-react";
import axios from "axios";

const ReelCard = ({ reel }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
    if (reel.product?._id && stored.includes(reel.product._id)) {
      setLiked(true);
    }
  }, [reel.product?._id]);

  // ---- Helpers ----
  const isYouTubeUrl = (url = "") =>
    /youtube\.com|youtu\.be/.test(url);

  const getYouTubeId = (url = "") => {
    // Shorts: https://youtube.com/shorts/VIDEOID?...
    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch?.[1]) return shortsMatch[1];

    // Watch: https://www.youtube.com/watch?v=VIDEOID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch?.[1]) return watchMatch[1];

    // youtu.be: https://youtu.be/VIDEOID
    const shortLinkMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortLinkMatch?.[1]) return shortLinkMatch[1];

    return null;
  };

  const videoId = useMemo(() => getYouTubeId(reel?.videoUrl || ""), [reel?.videoUrl]);

  // YouTube embed URL (autoplay works best with mute=1)
  const embedUrl = useMemo(() => {
    if (!videoId) return null;

    const autoplay = isPlaying ? 1 : 0;
    const mute = isMuted ? 1 : 0;

    // loop requires playlist=VIDEOID
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay}&mute=${mute}&playsinline=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0`;
  }, [videoId, isPlaying, isMuted]);

  const togglePlay = () => {
    setIsPlaying((p) => !p);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted((m) => !m);
  };

  const addToCart = (e) => {
    e.stopPropagation();
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItem = cartItems.find((x) => x.product === reel.product?._id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cartItems.push({
        product: reel.product?._id,
        name: reel.product?.name,
        image: reel.product?.images?.[0],
        price: reel.product?.price,
        qty: 1,
      });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert("Added to Cart!");
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const addToWishlist = async (e) => {
    e.stopPropagation();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        alert("Login to wishlist");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(
        "http://localhost:5002/api/users/wishlist",
        { productId: reel.product?._id },
        config
      );
      setLiked(true);

      const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
      if (reel.product?._id && !stored.includes(reel.product._id)) {
        localStorage.setItem('wishlistIds', JSON.stringify([...stored, reel.product._id]));
      }

      alert("Wishlisted!");
    } catch (error) {
      console.error(error);
      alert("Wishlist failed");
    }
  };

  const shareReel = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(reel?.videoUrl || window.location.href);
    alert("Link copied!");
  };

  const showYouTube = isYouTubeUrl(reel?.videoUrl) && embedUrl;

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] flex-shrink-0 bg-black rounded-2xl overflow-hidden border border-white/10 group snap-center">
      {/* Media Layer */}
      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay}>
        {showYouTube ? (
          <iframe
            key={`${videoId}-${isPlaying}-${isMuted}`}
            src={embedUrl}
            className="w-full h-full object-cover"
            title="YouTube Reel"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/70 p-6 text-center">
            This reel URL is not a playable video file.<br />
            Use YouTube link (shorts/watch) or provide direct .mp4/.webm URL.
          </div>
        )}

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <Play className="w-12 h-12 text-white/80 fill-white/80" />
          </div>
        )}
      </div>

      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 p-2 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition z-20"
      >
        {isMuted ? (
          <VolumeX size={16} className="text-white" />
        ) : (
          <Volume2 size={16} className="text-white" />
        )}
      </button>

      <div className="absolute bottom-32 right-4 flex flex-col gap-4 z-20">
        <button onClick={addToWishlist} className="flex flex-col items-center gap-1 group/btn">
          <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm group-hover/btn:bg-red-500/20 transition">
            <Heart size={24} className={liked ? "fill-red-500 text-red-500" : "text-white"} />
          </div>
        </button>

        <button onClick={shareReel} className="flex flex-col items-center gap-1 group/btn">
          <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm group-hover/btn:bg-white/20 transition">
            <Share2 size={24} className="text-white" />
          </div>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-3 flex items-center gap-3 shadow-lg z-20 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={reel.product?.images?.[0] || "https://via.placeholder.com/50"}
            alt={reel.product?.name || "Product"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-black truncate">
            {reel.product?.name || "Product Name"}
          </h4>
          <p className="text-xs text-gray-600">₹{reel.product?.price}</p>
        </div>

        <button
          onClick={addToCart}
          className="bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Buy Now
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default ReelCard;
