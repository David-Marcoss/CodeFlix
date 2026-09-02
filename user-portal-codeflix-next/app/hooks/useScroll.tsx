import { useEffect, useState } from "react";

export function useScroll() {
  const [isScroled, setIsScroled] = useState(false);

  useEffect(() => {
    const handleSroll = () => {
      if (window.scrollY > 0) {
        setIsScroled(true);
      } else {
        setIsScroled(false);
      }
    };

    window.addEventListener('scroll', handleSroll);

    return () => {
      window.removeEventListener('scroll', handleSroll);
    };
  }, []);

  return isScroled;
}
