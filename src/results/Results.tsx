import React from 'react';
import classNames from 'classnames';

import { Hit, Save } from '../types';
import Result from './Result';
import { ReactComponent as LoadingIcon } from '../icons/loading.svg';

import styles from './Results.module.css';

interface Props {
  loading?: boolean,
  error?: string,
  results: Hit[] | null,
  query?: string,
  tagClick?: (kw: string) => void,
  page: number,
  nextPage: () => void,
  saves: Map<number, Save>,
  toggleSave: (hit: Hit) => void
}

const Results = (props: Props) => {
  const { loading, error, results, query, tagClick, page, nextPage, saves, toggleSave } = props;

  const loader = (overlay: boolean) => <div className={classNames(styles.loading, { [styles.overlay]: overlay })}>
    <span className={styles.loadingIcon}>
      <LoadingIcon />
    </span>
  </div>;

  // infinite scrolling
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const lastElement = element?.children[element?.children.length - 1];
  const prevY = React.useRef(0);
  React.useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        entries => {
          const y = entries[0].boundingClientRect.y;
          const scrollingDown = prevY.current > entries[0].boundingClientRect.y;
          if (scrollingDown) {
            nextPage();
          }
          prevY.current = y;
        },
        { threshold: 0.1 }
      );
      if (lastElement) {
        observer.observe(lastElement);
      }
      return () => {
        // clean up
        if (lastElement) {
          observer.unobserve(lastElement);
        }
      };
    }
  }, [lastElement, loading, nextPage]);

  return (<>
    {error ? <div className={classNames(styles.msg, styles.error)}>{error}</div> : null}
    <div className={styles.results} ref={setElement}>
      {results && results.map((result: Hit, index: number) => (
        <Result
          key={`${index}-${result.id}`}
          result={result}
          query={query}
          tagClick={tagClick}
          saved={saves.has(result.id)}
          toggleSave={toggleSave}
        />
      ))}
      {results && !results.length ? <div className={styles.msg}>No Results Found</div> : null}
      {loading && page === 1 ? loader(true) : null}
    </div>
    {loading && page !== 1 ? loader(false) : null}
  </>);
};

export default React.memo(Results);