import React from 'react';

interface Props {
  className?: string,
  onSubmit: () => void,
  children: React.ReactNode
}

const Form = (props: Props) => {
  const { className, onSubmit, children } = props;
  return <form className={className} onSubmit={(e) => {
    e.preventDefault();
    onSubmit();
  }}>
    {children}
  </form>;
};

export default Form;