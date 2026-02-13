type RangeProps = {
  total: number;
  skip: number;
  limit: number;
};

export const Range = ({ total, skip, limit }: RangeProps) => {
  if (total === 0) return 'Показано 0 из 0';

  const from = skip + 1;
  const to = Math.min(skip + limit, total);

  return (
    <>
      {total === 0 ? (
        <>
          Показано <span>0</span> из <span>0</span>
        </>
      ) : (
        <>
          Показано{' '}
          <span>
            {from}-{to}
          </span>{' '}
          из <span>{total}</span>
        </>
      )}
    </>
  );
};
