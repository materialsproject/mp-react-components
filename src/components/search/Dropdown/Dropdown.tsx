import React, { useState } from 'react';
import { default as BulmaDropdown } from 'react-bulma-dropdown';
import 'react-bulma-dropdown/dist/main.css';

type Props = React.ComponentProps<typeof BulmaDropdown>;

export const Dropdown: React.FC<Props> = (props) => {
  return (
    <BulmaDropdown {...props}>
      {props.children}
    </BulmaDropdown>
  );
};

