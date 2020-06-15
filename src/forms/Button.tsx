import React from 'react';
import classNames from 'classnames';

import styles from './Button.module.css';

interface Props {
  className?: string,
  text: string
}

const Button = (props: Props) => {
  const { className, text } = props;
  return <button className={classNames(styles.button, className)}>{text}</button>;
};

export default Button;