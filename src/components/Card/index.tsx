function Card (props: { children: React.ReactNode; className?: string; }) {
  return (
    <div
    className={`
    bg-gray-100 dark:bg-gray-800
    border border-gray-900 dark:border-gray-600
    rounded-xl py-8 px-5
    overflow-y-auto
    ${props.className}
    `}
    >
      {props.children}
    </div>
  );
};

export default Card;
