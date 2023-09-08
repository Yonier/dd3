export type Status = 'correct' | 'incorrect' | 'present';

function Letter (props: {
  children: React.ReactNode;
  status?: Status;
  disabled?: boolean
}) {
  return (
    <div
    className={`
    w-12 h-12
    dark:bg-transparent
    border border-gray-900 dark:border-gray-600
    ${props.status === 'correct' ? '!bg-lime-600 !border-0' : (
      props.status === 'incorrect' ? '!bg-gray-500 !border-0' : (
        props.status === 'present' ? '!bg-yellow-500 !border-0' : 'bg-white'
      )
    )}
    ${props.disabled ? '!border-0 !bg-gray-200 dark:!bg-gray-600' : ''}
    text-black dark:text-white
    ${props.status ? '!text-white' : ''}
    rounded-md
    flex justify-center items-center uppercase font-bold text-2xl
    select-none
    `}
    >
      { !props.disabled && props.children ? props.children : undefined }
    </div>
  );
}

export default Letter;
