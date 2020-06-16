/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import classNames from 'classnames';

import { Hit } from '../types';
import { ReactComponent as LikeIcon } from '../icons/thumbs-up.svg';
import { ReactComponent as FavoriteIcon } from '../icons/star.svg';
import { ReactComponent as HeartIcon } from '../icons/heart.svg';
import { ReactComponent as HeartFilledIcon } from '../icons/heart-fill.svg';

import styles from './Result.module.css';

interface Props {
  result: Hit,
  query?: string,
  tagClick?: (kw: string) => void,
  saved: boolean,
  toggleSave: (hit: Hit) => void
}

const Result = (props: Props) => {
  const { result, query, tagClick, saved, toggleSave } = props;
  return (
    <div className={styles.result}>
      <a className={styles.photo} href={result.pageURL} target="_blank">
        <button
          className={classNames(
            styles.save,
            { [styles.saved]: saved }
          )}
          onClick={(e) => { e.preventDefault(); toggleSave(result); }}
        >
          <HeartIcon className={styles.heartIcon} />
          <HeartFilledIcon className={styles.heartFilledIcon} />
        </button>
        <img className={styles.img} src={result.webformatURL} alt={result.tags} />
        <span className={styles.imgBlur} style={{ backgroundImage: `url(${result.previewURL})` }}></span>
      </a>
      <div className={styles.info}>
        <div className={styles.tags}>
          {result.tags.split(',').map(t => {
            const tag = t.toLocaleLowerCase().trim();
            const selected = query?.toLocaleLowerCase().trim() === tag;
            return (
              <button
                className={classNames(
                  styles.tag,
                  { [styles.selected]: selected }
                )}
                onClick={() => !selected && tagClick && tagClick(tag)}
                key={tag}
              >
                {tag}
              </button>
            );
          }
          )}
        </div>
        <div className={styles.counts}>
          <span className={styles.count}><span className={styles.countText}>{result.likes}</span> <LikeIcon /></span>
          <span className={styles.count}><span className={styles.countText}>{result.favorites}</span> <FavoriteIcon /></span>
        </div>
      </div>
    </div>
  );
};

export default Result;