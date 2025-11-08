import { useState, useEffect } from 'react';

const ScrollToTopArrow = () => {
  // State to track whether the arrow should be visible
  const [isVisible, setIsVisible] = useState(false);

  // Function to toggle visibility based on scroll position
  const toggleVisibility = () => {
    // Show button if page is scrolled more than 300px
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Function to scroll to the top of the page smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // for a smooth scrolling experience
    });
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {/* The button is rendered only if isVisible is true */}
      {isVisible && (
        <button onClick={scrollToTop} className="arrow-button" aria-label="Go to top">
          &#8679; {/* This is a Unicode character for an upward arrow */}
        </button>
      )}

      {/* You can add the CSS directly here using a style tag for simplicity */}
      <style>{`
        .scroll-to-top .arrow-button {
          position: fixed;
          bottom: 5rem;
          right: 1.5rem;
          background-color: #ffffffff;
          color: #007bff;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: opacity 0.3s, transform 0.3s;
          opacity: 0.8;
        }

        .scroll-to-top .arrow-button:hover {
          opacity: 1;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ScrollToTopArrow;