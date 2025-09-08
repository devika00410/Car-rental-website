// src/components/ThemeDebugger.jsx
import React from 'react';
import { useTheme } from '../Context/ThemeContext';

const ThemeDebugger = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border z-50">
      <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
        Theme Debugger
      </h3>
      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
        Current mode: <strong>{darkMode ? 'Dark' : 'Light'}</strong>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        HTML has 'dark' class: <strong>{document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</strong>
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        localStorage: <strong>{localStorage.getItem('darkMode')}</strong>
      </p>
      <button
        onClick={toggleDarkMode}
        className="px-3 py-1 bg-violet-600 text-white rounded text-xs"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeDebugger;