"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the user is on a mobile device
 * @returns {boolean} true if on mobile, false otherwise
 */
export function useMobileDetection(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    /**
     * Function to check if device is mobile based on screen width and user agent
     */
    const checkIfMobile = (): boolean => {
      // Check screen width (mobile typically <= 768px)
      const isSmallScreen = window.innerWidth <= 768;
      
      // Check user agent for mobile devices
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        "mobile",
        "android",
        "iphone",
        "ipod",
        "blackberry",
        "windows phone",
        "webos"
      ];
      
      const isMobileUserAgent = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      );
      
      return isSmallScreen || isMobileUserAgent;
    };

    /**
     * Handle resize events to update mobile detection
     */
    const handleResize = (): void => {
      setIsMobile(checkIfMobile());
    };

    // Initial check
    setIsMobile(checkIfMobile());

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
} 