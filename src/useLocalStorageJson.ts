import { Dispatch } from 'react';
import useLocalStorage from 'react-use-localstorage';

const safeStringify = (obj: object | undefined): string => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return '';
  }
};

const safeParse = (str: string | undefined): object | undefined => {
  try {
    return str && JSON.parse(str);
  } catch (e) { }
};

const useLocalStorageJson = (key: string, initialObjectValue?: object): [object | undefined, Dispatch<object | undefined>] => {
  const initialStringValue = safeStringify(initialObjectValue);
  const [stringValue, setStringValue] = useLocalStorage(key, initialStringValue);
  const jsonValue = safeParse(stringValue);
  const setJsonValue = (obj: object | undefined) => setStringValue(safeStringify(obj));
  return [jsonValue, setJsonValue];
};

export default useLocalStorageJson;