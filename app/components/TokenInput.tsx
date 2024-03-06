import { FixedNumber } from 'ethers';
import { FunctionComponent, useState } from 'react';

import { filterAllowedCharacters, getFormattedNumber, getNumberAsUInt128 } from '~/utils';

export const TokenInput: FunctionComponent<{
  decimals: number;
  id?: string;
  readonly?: boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  afterInputChange?: Function;
  onValueChange?: (value: FixedNumber) => void | Promise<void>;
  className?: string;
}> = ({ id, readonly, placeholder, decimals, afterInputChange, onValueChange, className }) => {
  const [value, setValue] = useState('');

  const onInputChange = () => {
    if (afterInputChange) {
      afterInputChange();
    }
  };

  return (
    <input
      className={`${readonly ? 'cursor-default' : ''} ${className ?? ''} line-height-10 font-size-5`}
      type="string"
      id={id}
      value={value}
      readOnly={readonly ?? false}
      placeholder={placeholder ?? '0.0'}
      onInput={onInputChange}
      onChange={(event) => {
        const newValue = filterAllowedCharacters(event.target.value);
        if (value !== newValue) {
          if (onValueChange) {
            const quantity = getFormattedNumber(newValue, decimals);
            const [res] = getNumberAsUInt128(quantity, decimals);
            const fixedNumber = FixedNumber.fromValue(res, decimals).toFormat(decimals);
            onValueChange(fixedNumber);
          }
          setValue(newValue);
        }
      }}
      onBlur={(event) => {
        const quantity = getFormattedNumber(event.target.value, decimals);
        setValue(quantity);
      }}
      autoComplete="off"
    />
  );
};
