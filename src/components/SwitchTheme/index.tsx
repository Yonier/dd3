import { useEffect, useState } from 'react';
import './index.css';

export default function SwitchTheme () {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (darkMode)
      document.body.classList.add('dark');
    else
      document.body.classList.remove('dark');

    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  return (
    <label
    className="
    switch relative inline-block w-12 h-6
    bg-gray-300 rounded-full
    flex items-center px-1
    cursor-pointer
    "
    >
      <input
      type="checkbox"
      className="hidden"
      checked={!darkMode}
      onChange={() => setDarkMode(!darkMode)}
      />
      <span className="slider w-4 h-4 shadow-2xl transition-all duration-200 rounded-full ml-0"></span>
    </label>
  );
}
