import React, { useEffect, useRef, useState } from 'react';
import { Select } from '../Select';

interface Option {
  value: any;
  label: string | number;
}

interface Props {
  options: Option[];
  value?: boolean;
  onChange?: (value: any) => void;
}

export const ThreeStateBooleanSelect: React.FC<Props> = ({ options, value, onChange }) => {
  const threeOptions = [options[0], options[1], { label: 'Any', value: undefined }];
  const selected = threeOptions.find((option) => option.value === value);
  return (
    <Select options={threeOptions} value={selected} menuPosition="fixed" onChange={onChange} />
  );
};
