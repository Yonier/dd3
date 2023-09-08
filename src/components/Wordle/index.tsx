import { useRef, useState, useEffect } from 'react';

import SwitchTheme from '../SwitchTheme';
import Card from '../Card';
import Modal from '../Modal';
import Keyboard from './Keyboard';
import Letter from './Letter';
import IconsSpinner from '../Icons/Spinner';

import { seconds2MMSS } from '../../utils/misc';

import type { Status } from './Letter';

function Wordle () {
  const didMount = useRef(false);

  const [helpModal, setHelpModal] = useState(false);
  const [statsModal, setStatsModal] = useState(false);

  // Estadisticas
  const [rounds, setRounds] = useState(0);
  const [wins, setWins] = useState(0);

  const [actualWord, setActualWord] = useState('');

  let [wordsTxt, setWordsTxt] = useState('');

  /**
   * Obtener palabra de 5 letras aleatoria sin tildes
   */
  const randomWord = () => {
    const tildes = {
      'á': 'a',
      'é': 'e',
      'í': 'i',
      'ó': 'o',
      'ú': 'u'
    };

    const word = (wordsTxt.split('\n').filter(w => w.length === 5).sort(
      () => Math.random() - 0.5
    )[0]).toLowerCase().replace(/[áéíóú]/g, c => (tildes as any)[c] || c);
    // console.log(word)

    return word;
  }

  const [words, setWords] = useState<({
    status: undefined | Status
    value: string
  }[])[]>([]); // Letras de palabras ingresadas
  const [wordIx, setWordIx] = useState(0); // Palabra actual
  const [didWon, setDidWon] = useState(false);

  const [newRoundSecondsLeft, setNewRoundSecondsLeft] = useState(0);

  // Iniciar el juego
  const newRound = () => {
    setActualWord(randomWord());
    setWords([]);
    setWordIx(0);
    setDidWon(false);
  }

  /**
   * Contador nueva ronda
   */
  const newRoundSecondsLeftTick = () => {
    if(newRoundSecondsLeft < 0) return;

    if(newRoundSecondsLeft <= 0) {
      newRound();
    } else {
      setTimeout(() => {
        setNewRoundSecondsLeft(newRoundSecondsLeft - 1);
      }, 1000);
    }
  };
  useEffect(() => {
    if(!didMount.current) return;

    newRoundSecondsLeftTick();
  }, [newRoundSecondsLeft]);

  /**
   * Iniciar contador nueva ronda
   */
  const newRoundWait = () => {
    setRounds(rounds + 1);
    // setNewRoundSecondsLeft(5); // 5 minutos
    setNewRoundSecondsLeft(60 * 5); // 5 minutos
  };

  /**
   * Usuario presiona una tecla
   */
  const onKeyboardInput = (k: string) => {
    if(newRoundSecondsLeft > 0) return;

    const word = words[wordIx];
    const wordFull = word?.map(w => w.value).join('');
    if (k === '$R') {
      if(word && word.length === 5){
        if (actualWord.toLowerCase() === wordFull.toLowerCase()) {
          setDidWon(true);
          setWins(wins + 1);
          setStatsModal(true);
          newRoundWait();
        } else {
          if(words.length >= 5) {
            setStatsModal(true);
            newRoundWait();
          } else {
            setWordIx(wordIx + 1);
          }
        }

        // Setear resultado de la palabra
        setWords(() => {
          const w = [...words];
          for (const [letterIx, letter] of w[wordIx].entries()) {
            if (letter.value.toLowerCase() === actualWord[letterIx].toLowerCase()) {
              w[wordIx][letterIx].status = 'correct';
            } else if (actualWord.toLowerCase().includes(letter.value.toLowerCase())) {
              w[wordIx][letterIx].status = 'present';
            } else {
              w[wordIx][letterIx].status = 'incorrect';
            }
          }

          return w;
        });
      }
    } else if (k === '$D') {
      if(word?.length > 0)
        setWords(() => {
          const w = [...words];
          if(w[wordIx])
            w[wordIx].pop();

          return w;
        });
    } else {
      if(!words[wordIx] || words[wordIx].length < 5)
        setWords(() => {
          const w = [...words];
          if(!w[wordIx])
            w[wordIx] = [];

          w[wordIx].push({
            status: undefined,
            value: k
          });

          return w;
        });
    }
  }

  useEffect(() => {
    if(!didMount.current)
      didMount.current = true;

    if(wordsTxt.length <= 0) {
      fetch('/assets/words.txt')
      .then(async res => {
        setWordsTxt(await res.text());
      })
    } else {
      newRound();
    }
  }, [wordsTxt]);

  return (
    <div className="w-full h-full flex flex-col">
      <Modal active={helpModal}>
        <Card
        className='h-full'
        >
          <h1 className='text-center text-2xl font-bold mb-4'>Cómo jugar</h1>
          <p>Adivina la palabra oculta en cinco intentos.</p><br/>
          <p>Cada intento debe ser una palabra válida de 5 letras.</p><br/>
          <p>Después de cada intento el color de las letras cambia para mostrar qué tan cerca estás de acertar la palabra.</p><br/>
          <h4 className='font-bold'>Ejemplos</h4>
          <div className="flex my-4">
            <div className='flex mx-auto gap-2'>
              {[...'GATOS'].map((lt, ltIx) => (
                <Letter
                key={ltIx}
                status={ltIx === 0 ? 'correct' : undefined}
                >
                  {lt}
                </Letter>
              ))}
            </div>
          </div>
          <p>La letra <strong>G</strong> está en la palabra y en la posición correcta.</p>
          <div className="flex my-4">
            <div className='flex mx-auto gap-2'>
              {[...'VOCAL'].map((lt, ltIx) => (
                <Letter
                key={ltIx}
                status={ltIx === 2 ? 'present' : undefined}
                >
                  {lt}
                </Letter>
              ))}
            </div>
          </div>
          <p>La letra <strong>C</strong> está en la palabra pero en la posición incorrecta.</p>
          <div className="flex my-4">
            <div className='flex mx-auto gap-2'>
              {[...'CANTO'].map((lt, ltIx) => (
                <Letter
                key={ltIx}
                status={ltIx === 4 ? 'incorrect' : undefined}
                >
                  {lt}
                </Letter>
              ))}
            </div>
          </div>
          <p>La letra <strong>O</strong> no está en la palabra.</p><br/>
          <p>Puede haber letras repetidas. Las pistas son independientes para cada letra.</p><br/>
          <p className='text-center'>¡Una palabra nueva cada 5 minutos!</p><br/>
          <button
          className='bg-lime-600 rounded text-white text-xl font-bold py-2 px-9 flex mx-auto'
          onClick={() => setHelpModal(false)}
          >!JUGAR¡</button>
        </Card>
      </Modal>
      <Modal active={statsModal}>
        <Card
        className='w-full'
        >
          <h1 className='text-center text-2xl font-bold'>Estadísticas</h1>
          <div className='flex justify-evenly text-sm py-8'>
            <div className='text-center flex flex-col'>
              <strong className='text-2xl'>{rounds}</strong>
              <span>Jugadas</span>
            </div>
            <div className='text-center flex flex-col'>
              <strong className='text-2xl'>{wins}</strong>
              <span>Victorias</span>
            </div>
          </div>
          {
            newRoundSecondsLeft > 0 && !didWon && (
              <div className='text-center pb-4 text-sm'>
                La palabra era: <strong className='uppercase'>{actualWord}</strong>
              </div>
            )
          }
          {
            newRoundSecondsLeft > 0 && (
            <div className='text-center pb-4 text-sm'>
              <p className='mb-2'>SIGUIENTE PALABRA</p>
              <strong>{seconds2MMSS(newRoundSecondsLeft)}</strong>
            </div>
            )
          }
          <button
          className='bg-lime-600 rounded text-white text-xl font-bold py-2 px-9 flex mx-auto'
          onClick={() => setStatsModal(false)}
          >Aceptar</button>
        </Card>
      </Modal>

      <header
      className="bg-gray-100 dark:bg-gray-700 flex justify-between items-center px-4 py-3 lg:rounded-xl"
      >
        <button
        className="bg-gray-500 dark:bg-white dark:text-gray-800 hover:opacity-70 text-white text-center font-bold rounded-full w-6 h-6"
        onClick={() => setHelpModal(true)}
        >?</button>
        <h1 className="text-3xl uppercase font-semibold m-auto pl-12">Wordle</h1>
        <div className='flex items-center h-full gap-2'>
          <button
          className='bg-gray-500 dark:bg-white hover:opacity-70 text-white font-bold py-1 w-6 h-5 self-center flex justify-center gap-1 rounded'
          onClick={() => setStatsModal(true)}
          >
            <div className='!w-0.5 !h-full max-h-fill !mt-1 bg-white dark:bg-gray-800 rounded'> </div>
            <div className='!w-0.5 !h-full max-h-fill !mt-1 bg-white dark:bg-gray-800 rounded'> </div>
            <div className='!w-0.5 h-full bg-white dark:bg-gray-800 rounded'> </div>
          </button>
          <SwitchTheme/>
        </div>
      </header>
      <main className='pt-12 pb-8 flex-grow flex justify-center items-center'>
        {
          wordsTxt.length <= 0
            ? <IconsSpinner/>
            : (
              <div className='flex flex-col gap-2'>
                {Array.from({ length: 5 }).map((_, wordRowIx) => (
                  <div className='flex gap-2' key={wordRowIx}>
                    {Array.from({ length: 5 }).map((_, letterIx) => (
                      <Letter
                      key={letterIx}
                      status={words[wordRowIx]?.[letterIx]?.status}
                      disabled={wordIx < wordRowIx}
                      >
                        {words[wordRowIx]?.[letterIx]?.value || ''}
                      </Letter>
                    ))}
                  </div>
                ))}
              </div>
            )
        }
      </main>
      {
        wordsTxt.length > 0 && (
          <footer
          className="bg-gray-100 dark:bg-gray-700 px-2 py-4 flex justify-center align-center lg:rounded-xl"
          >
            <Keyboard
            onKeyboardInput={onKeyboardInput}
            words={words}
            />
          </footer>
        )
      }
    </div>
  );
}

export default Wordle;
