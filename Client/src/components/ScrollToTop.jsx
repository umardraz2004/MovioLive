import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiArrowUp } from "react-icons/fi";

const ScrollToTop = ({ showButton = false, threshold = 300 }) => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Auto scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Show/hide button based on scroll position
  useEffect(() => {
    if (!showButton) return;

    let timeoutId = null;
    
    const toggleVisibility = () => {
      // Throttle the scroll events to prevent excessive state updates
      if (timeoutId) return;
      
      timeoutId = setTimeout(() => {
        const shouldShow = window.pageYOffset > threshold;
        if (shouldShow !== isVisible) {
          setIsVisible(shouldShow);
        }
        timeoutId = null;
      }, 16); // ~60fps
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showButton, threshold, isVisible]);

  const scrollToTop = () => {
    // Use requestAnimationFrame to prevent flicker
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  };

  // If showButton is false, just return the auto scroll functionality
  if (!showButton) {
    return null;
  }

  // Render the scroll to top button
  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-br from-red-600 to-red-900 
                     text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,0,8)] 
                      transition-all duration-300 hover:scale-110 active:scale-95 
                      focus:outline-none z-30 backdrop-blur-sm border border-white/20"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
