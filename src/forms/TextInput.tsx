import React from 'react';
import classNames from 'classnames';

import styles from './TextInput.module.css';

interface Props {
  className?: string,
  value: string,
  onChange: (value: string) => void,
  placeholder?: string,
  autofocus: boolean
}

const TextInput = (props: Props) => {
  const { className, value, onChange, placeholder, autofocus } = props;
  return <input
    type="text"
    className={classNames(styles.textInput, className)}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    autoFocus={autofocus}
  />;
}

export default TextInput;