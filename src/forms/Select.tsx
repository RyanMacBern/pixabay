import React from 'react';
import classNames from 'classnames';

import styles from './Select.module.css';

interface Props {
  className?: string,
  options: string[],
  value: string | undefined,
  onChange: (value: string) => void,
  placeholder?: string
}

const Select = (props: Props) => {
  const { className, options, value, onChange, placeholder } = props;
  return options.length ?
    <select
      className={classNames(
        styles.select,
        className,
        {
          [styles.placeholder]: Boolean(placeholder && !value)
        }
      )}
      onChange={e => onChange(e.target.value)}
      value={value}
    >
      {placeholder ?
        value ?
          <option value="">none</option>
          :
          <option value="">{placeholder}</option>
        : null}
      {options.map((option: string) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
    : null;
}

export default Select;