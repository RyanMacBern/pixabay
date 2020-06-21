import React, { Dispatch } from 'react';
import { throttle } from 'lodash';

import settings from './settings.json';
import { Hit, Save } from './types';
import useLocalStorageJson from './useLocalStorageJson';
import Saves from './saves/Saves';
import Search from './search/Search';
import Results from './results/Results';
import { ReactComponent as CameraIcon } from './icons/camera.svg';
import { ReactComponent as ArrowUpIcon } from './icons/arrow-up.svg';

import styles from './App.module.css';

interface Records extends Record<string, string> { }

interface ApiParams extends Record<string, string | undefined> {
  key: string,
  q: string,
  category?: string,
  page: string,
  per_page: string
}

const PER_PAGE = 20;

const removeEmpty = (params: ApiParams): Records => {
  return Object.keys(params).reduce((newParams: Records, key: string) => {
    if (params[key] !== undefined) {
      newParams[key] = params[key] || ''
    }
    return newParams
  }, {});
};

const api = (params: ApiParams) => {
  const url = new URL(settings.apiEndpoint);
  url.search = new URLSearchParams(removeEmpty(params)).toString();
  return fetch(url.toString());
};

const App = () => {
  const [query, setQuery] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [hits, setHits] = React.useState<Hit[] | null>(null);
  const [max, setMax] = React.useState<number>(0);
  const [showBackToTop, setShowBackToTop] = React.useState<boolean>(false);
  const [runSearch, setRunSearch] = React.useState<boolean>(false);
  const [savesOpen, setSavesOpen] = React.useState<boolean>(false);

  // surface Search's setQuery so we can override its input text when a user clicks a tag
  let setInputText: Dispatch<string> | undefined;

  const totalPages = max && Math.floor(max / PER_PAGE);
  const [saves, setSaves] = useLocalStorageJson('saves', []);
  const savesMap: Map<number, Save> = saves instanceof Array ? new Map(saves.map((save: Save) => [save.id, save])) : new Map();

  const showError = React.useCallback((error: string) => {
    setLoading(false);
    setError(error);
    backToTop()
  }, []);

  const search = React.useCallback(() => {
    setError('');
    if (query) {
      setLoading(true);
      api({
        key: settings.apiKey,
        q: escape(query.trim()),
        category,
        page: page.toString(),
        per_page: PER_PAGE.toString()
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              setLoading(false);
              setHits(page > 1 && hits ? [...hits, ...data.hits] : data.hits);
              setMax(data.totalHits);
            });
          } else {
            showError(response.statusText);
          }
        }).catch(error => {
          showError(error.toString());
        });
    } else {
      setHits(null);
      setMax(0);
    }
  }, [category, hits, page, query, showError]);

  const onSubmit = (q: string, c: string) => {
    setQuery(q);
    setCategory(c);
    setPage(1);
    setMax(0);
    setRunSearch(true);
  };

  const tagClick = React.useCallback((q: string) => {
    setInputText && setInputText(q);
    setQuery(q);
    setPage(1);
    setMax(0);
    setRunSearch(true);
    backToTop();
  }, [setInputText]);

  const nextPage = React.useCallback(() => {
    if (hits?.length && page < totalPages && !loading && !error) {
      setLoading(true);
      setPage(page + 1);
      setRunSearch(true);
    }
  }, [error, hits, loading, page, totalPages]);

  const backToTop = () => {
    window.scrollTo(0, 0);
  }

  React.useEffect(() => {
    const toggleBackToTop = throttle(() => setShowBackToTop(window.scrollY > 0), 500);
    window.addEventListener('scroll', toggleBackToTop);
    return () => {
      window.removeEventListener('scroll', toggleBackToTop);
    };
  });

  React.useEffect(() => {
    if (runSearch) {
      setRunSearch(false);
      search();
    }
  }, [runSearch, search]);

  const toggleSave = (hit: Hit) => {
    if (savesMap.has(hit.id)) {
      removeSave(hit.id);
    } else {
      addSave(hit);
    }
  };

  const addSave = (hit: Hit) => {
    const save: Save = {
      id: hit.id,
      pageURL: hit.pageURL,
      previewURL: hit.previewURL
    }
    savesMap.set(save.id, save);
    // always open the sidebar after saving a new photo
    setSavesOpen(true);
    setSaves(Array.from(savesMap.values()));
  }

  const removeSave = (id: number) => {
    savesMap.delete(id);
    if (savesMap.size === 0) {
      // last save removed, close the saves sidebar
      setSavesOpen(false);
    }
    setSaves(Array.from(savesMap.values()));
  };

  return (<>
    <div className={styles.wrapper}>
      <Saves saves={savesMap} remove={removeSave} open={savesOpen} setOpen={setSavesOpen} />
      <div className={styles.logo}>
        <a href="/">
          <CameraIcon />
        </a>
      </div>
      <Search onSubmit={onSubmit}>
        {({ setQuery }) => { setInputText = setQuery }}
      </Search>
      <Results
        results={hits}
        loading={loading}
        error={error}
        query={query}
        tagClick={tagClick}
        page={page}
        nextPage={nextPage}
        saves={savesMap}
        toggleSave={toggleSave}
      />
    </div>
    {showBackToTop ?
      <button className={styles.backToTop} onClick={backToTop}>
        <ArrowUpIcon className={styles.backToTop} onClick={backToTop} />
      </button>
      : null}
  </>);
}

export default App;
