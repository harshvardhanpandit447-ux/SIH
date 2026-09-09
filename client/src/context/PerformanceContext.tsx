import React, { createContext, useContext, useState, useEffect } from 'react';

interface PerformanceContextType {
  isLiteMode: boolean;
  isLowSpecDevice: boolean;
  toggleLiteMode: () => void;
  setLiteMode: (enabled: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLiteMode, setIsLiteModeState] = useState<boolean>(() => {
    // Check saved preference - default to false so rich animation runs
    const saved = typeof window !== 'undefined' ? localStorage.getItem('agro_lite_mode') : null;
    if (saved !== null) {
      return saved === 'true';
    }
    return false;
  });

  const [isLowSpecDevice, setIsLowSpecDevice] = useState<boolean>(false);

  useEffect(() => {
    const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
    const deviceMemory = nav?.deviceMemory;
    const cores = nav?.hardwareConcurrency;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const detectedLowSpec = isMobile || (deviceMemory && deviceMemory <= 2) || (cores && cores <= 2);
    setIsLowSpecDevice(!!detectedLowSpec);

    // Apply class to body for global CSS performance optimizations if enabled
    if (isLiteMode) {
      document.documentElement.classList.add('lite-mode');
    } else {
      document.documentElement.classList.remove('lite-mode');
    }
  }, [isLiteMode]);

  const toggleLiteMode = () => {
    setIsLiteModeState(prev => {
      const next = !prev;
      localStorage.setItem('agro_lite_mode', String(next));
      return next;
    });
  };

  const setLiteMode = (enabled: boolean) => {
    setIsLiteModeState(enabled);
    localStorage.setItem('agro_lite_mode', String(enabled));
  };

  return (
    <PerformanceContext.Provider
      value={{
        isLiteMode,
        isLowSpecDevice,
        toggleLiteMode,
        setLiteMode,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
