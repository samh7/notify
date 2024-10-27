import React, { useEffect } from 'react';
import useMyStore from '../store/store';

const Alert = ({ alertT }) => {
  const { alert, setAlert } = useMyStore();

  useEffect(() => {
    
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert, setAlert]);

  if (!alert) return null;

  const getBackgroundColor = () => {
    switch (alert.type) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f97316';
      case 'success':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="fixed z-[200] top-4 right-4  p-4 rounded-md shadow-md text-white font-semibold"
         style={{ backgroundColor: getBackgroundColor() }}>
      {alert.message}
    </div>
  );
};

export default Alert;
