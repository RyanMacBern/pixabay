/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import classNames from 'classnames';

import { Save } from '../types';
import { ReactComponent as HeartFilledIcon } from '../icons/heart-fill.svg';
import { ReactComponent as CloseIcon } from '../icons/arrow-bar-right.svg';
import { ReactComponent as XIcon } from '../icons/x-circle.svg';
import { ReactComponent as XFilledIcon } from '../icons/x-circle-fill.svg';

import styles from './Saves.module.css';

interface Props {
  className?: string,
  saves: Map<number, Save>,
  remove: (id: number) => void,
  open: boolean,
  setOpen: (o: boolean) => void
}

const Saves = (props: Props) => {
  const { className, saves, remove, open, setOpen } = props;
  return (
    <div className={classNames(styles.saves, { [styles.open]: open }, className)}>
      {saves.size > 0 ?
        <button className={styles.opener} onClick={() => setOpen(true)}>
          <HeartFilledIcon />
        </button>
        : null}
      <div className={styles.sidebar}>
        <div className={styles.inner}>
          <div className={styles.title} onClick={() => setOpen(false)}>
            <HeartFilledIcon className={styles.titleIcon} />Saves
          </div>
          <button className={styles.closer} onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
          <div className={styles.savesList}>
            {Array.from(saves.values()).map(save => (
              <div className={styles.save} key={save.id}>
                <a className={styles.photo} href={save.pageURL} target="_blank">
                  <img className={styles.img} src={save.previewURL} alt={save.id.toString()} />
                  <button className={styles.remove} onClick={e => { e.preventDefault(); remove(save.id); }}>
                    <XIcon className={styles.xIcon} />
                    <XFilledIcon className={styles.xFilledIcon} />
                  </button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saves;