import React, { useEffect, useState } from 'react';
import lightBackgroundImage from '../static/backgroundimage_light.png';
import darkBackgroundImage from '../static/backgroundimage_dark.png';

type BackgroundProps = {
  children: React.ReactNode;
  offset?: number;
};

const Background: React.FC<BackgroundProps> = ({ children, offset = 60 }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const backgroundImage = isDarkMode ? darkBackgroundImage : lightBackgroundImage;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        paddingTop: `${offset}px`,
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-80 filter blur-3xl"></div> {/* More transparent mask with more blur */}
      <div className="relative z-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export default Background;
