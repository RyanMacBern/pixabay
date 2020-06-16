import React from 'react';

import settings from '../settings.json';
import Form from '../forms/Form';
import TextInput from '../forms/TextInput';
import Select from '../forms/Select';
import Button from '../forms/Button';

import styles from './Search.module.css'

interface Props {
  onSubmit: (query: string, category: string) => void,
  children: (c: ChildrenProps) => void
}

interface ChildrenProps {
  setQuery: (query: string) => void,
};

const Search = (props: Props) => {
  const { onSubmit, children } = props;

  const [query, setQuery] = React.useState<string>('');
  const [category, setCategory] = React.useState<string>('');

  return <>
    {children({ setQuery })}
    <Form className={styles.form} onSubmit={() => onSubmit(query, category)}>
      <div className={styles.fields}>
        <TextInput
          className={styles.field}
          value={query}
          onChange={setQuery}
          placeholder="keyword(s)"
          autofocus
        />
        <Select
          className={styles.field}
          options={settings.categories}
          value={category}
          onChange={setCategory}
          placeholder="category"
        />
      </div>
      <Button className={styles.button} text="Search" />
    </Form>
  </>;
};

export default Search;