import s from '@/components/progressBar/ProgressBar.module.scss';

export const ProgressBar = ({ active }: { active: boolean }) => (
  <>
    {active ? (
      <div className={s.progressBar} role="progressbar" aria-label="Загрузка">
        <div className={s.progressBar__bar} />
      </div>
    ) : null}
  </>
);
