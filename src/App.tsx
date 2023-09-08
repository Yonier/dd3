import './App.css';
import Wordle from './components/Wordle';

function App() {

  return (
    <div id="App" className="
    w-full h-screen
    flex justify-center align-center items-center
    dark:bg-gray-800 text-black dark:text-white
    ">
      <div className='w-full h-full lg:w-2/5 lg:max-h-[60vh]'>
        <Wordle/>
      </div>
    </div>
  );
}

export default App;
