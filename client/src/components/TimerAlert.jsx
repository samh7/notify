import React from 'react';
import useMyStore from '../store/store';

const TimerAlert = () => {
  const { timerAlerts, removeTimerAlert } = useMyStore();

  if (timerAlerts.length === 0) return null;

  return (
    <div className="fixed z-[200] top-4 right-4 max-w-md">
      {timerAlerts.map((alert) => (
        <div 
          key={alert.id} 
          className="bg-red-500 text-white p-4 rounded-md shadow-md mb-2 flex justify-between items-center"
        >
          <div>
            <p className="font-bold">Timer Expired!</p>
            <p>{alert.noteTitle}</p>
          </div>
          <button 
            onClick={() => removeTimerAlert(alert.id)}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            Close
          </button>
        </div>
      ))}
    </div>
  );
};

export default TimerAlert;
