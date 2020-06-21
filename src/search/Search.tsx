import React from 'react';

import settings from '../settings.json';
import Form from '../forms/Form';
import TextInput from '../forms/TextInput';
import Select from '../forms/Select';
import Button from '../forms/Button';

import styles from './Search.module.css'

interface Props {
  query: string,
  onSubmit: (query: string, category: string) => void
}

const Search = (props: Props) => {
  const { onSubmit, query: initialQuery } = props;

  const [query, setQuery] = React.useState<string>(initialQuery);
  const [category, setCategory] = React.useState<string>('');

  React.useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
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
  );
};

export default React.memo(Search);