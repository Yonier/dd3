export default function Modal (props: {
  active: boolean
  children: React.ReactNode;
}) {
  if(!props.active) return null;

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 w-full h-full fixed top-0 left-0 flex content-center justify-center z-50 p-4 lg:p-0'>
      <div className='w-full lg:w-2/5 h-full lg:h-[80vh] self-center flex justify-center items-center'>
        { props.children }
      </div>
    </div>
  );
}
