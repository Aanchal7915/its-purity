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
    alert('Added to Cart!');
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const addToWishlist = async (e) => {
    e.stopPropagation();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
        alert('Login to wishlist');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/wishlist`,
        { productId: reel.product?._id },
        config
      );
      setLiked(true);

      const stored = JSON.parse(localStorage.getItem('wishlistIds')) || [];
      if (reel.product?._id && !stored.includes(reel.product._id)) {
        localStorage.setItem('wishlistIds', JSON.stringify([...stored, reel.product._id]));
      }

      alert('Wishlisted!');
    } catch (error) {
      console.error(error);
      alert('Wishlist failed');
    }
  };

  const shareReel = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(reel?.videoUrl || window.location.href);
    alert('Link copied!');
  };

  const showYouTube = isYouTubeUrl(reel?.videoUrl) && embedUrl;

  return (
    <div className="flex flex-col w-full h-[280px] sm:h-[500px] flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-gray-200 group snap-center shadow-md hover:shadow-xl transition-all duration-300">
      {/* Media Layer */}
      <div className="relative flex-1 bg-black overflow-hidden cursor-pointer" onClick={togglePlay}>
        {showYouTube ? (
          <iframe
            key={videoId + "-" + isPlaying + "-" + isMuted}
            src={embedUrl}
            className="w-full h-full object-cover"
            title="YouTube Reel"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ pointerEvents: 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/70 p-6 text-center bg-zinc-900">
            <Play className="w-12 h-12 mb-2 opacity-50" />
          </div>
        )}

        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <Play className="w-12 h-12 text-white/80 fill-white/80" />
          </div>
        )}

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 p-2 bg-black/40 rounded-full backdrop-blur-sm hover:bg-black/60 transition z-30"
        >
          {isMuted ? (
            <VolumeX size={14} className="text-white" />
          ) : (
            <Volume2 size={14} className="text-white" />
          )}
        </button>

        {/* Side Actions (Heart/Share/Views) on Video */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-3 z-30">
          <button onClick={addToWishlist} className="group/btn relative">
            <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm group-hover/btn:bg-red-500/20 transition">
              <Heart size={20} className={liked ? "fill-red-500 text-red-500" : "text-white"} />
            </div>
          </button>

          <button onClick={shareReel} className="group/btn relative">
            <div className="p-2 bg-black/40 rounded-full backdrop-blur-sm group-hover/btn:bg-white/20 transition">
              <Share2 size={20} className="text-white" />
            </div>
          </button>
        </div>

        {/* Gradient Overlay for text visibility */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
      </div>

      {/* Product Footer */}
      <div className="p-2 md:p-3 bg-white flex flex-col gap-2 md:gap-3 relative z-20">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
            <img
              src={reel.product?.images?.[0] || "https://via.placeholder.com/50"}
              alt={reel.product?.name || "Product"}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[10px] md:text-sm text-gray-900 truncate leading-tight">
              {reel.product?.name || "Product Name"}
            </h4>
            <p className="text-[9px] md:text-xs text-gray-500 font-medium mt-0.5">₹{reel.product?.price}</p>
          </div>
        </div>

        <button
          onClick={addToCart}
          className="w-full bg-black text-white text-[10px] md:text-xs font-bold py-1.5 md:py-2.5 rounded-lg hover:bg-gray-800 transition shadow-sm active:scale-[0.98]"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ReelCard;
