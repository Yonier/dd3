import IconsDelete from '../../Icons/Delete';

import type { Status } from '../Letter';

function Keyboard (props: {
  onKeyboardInput: (key: string) => void
  words: ({
    status: undefined | Status
    value: string
  }[])[]
}) {
  const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ',
    '$R', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '$D'
  ];

  return (
    <div className='flex flex-col flex-wrap gap-1'>
      {[
        keys.slice(0, 10),
        keys.slice(10, 20),
        keys.slice(20, 30),
      ].map((keysRow, keysRowIx) => (
        <div
        className={`flex gap-1 ${
          keysRowIx === 0 ? 'pl-4' : (
            keysRowIx === 1 ? 'pl-6' : ''
          )
        }`}
        key={keysRowIx}
        >
        {keysRow.map((key, keyIx) => {
          const keyWordLetter = props.words.flat().find(
            wl => !key.startsWith('$') && wl.value.toLowerCase() === key.toLowerCase()
          );

          return (
          <div
          className={`
            ${key.startsWith('$') ? 'w-12' : 'w-8'}
            h-8
            ${key === '$R' ? 'text-xs' : 'text-md'}
            bg-gray-400 hover:opacity-70
            ${keyWordLetter ?
              keyWordLetter.status === 'correct' ? '!bg-lime-600' : (
              keyWordLetter.status === 'incorrect' ? '!bg-gray-500' : (
                keyWordLetter.status === 'present' ? '!bg-yellow-500' : ''
              )
            ) : ''}
            cursor-pointer select-none
            rounded-md text-white flex justify-center items-center uppercase font-semibold
          `}
          key={keyIx}
          onClick={() => props.onKeyboardInput(key)}
          >
            {
              key === '$R'
                ? 'ENTER'
                  : key === '$D'
                    ? <IconsDelete/>
                      : key
            }
          </div>
          )
        })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
