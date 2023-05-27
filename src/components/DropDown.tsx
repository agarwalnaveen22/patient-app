import * as React from 'react';
import {CheckIcon, Select} from 'native-base';

type Options = {
  label: string;
  value: string;
};

type Props = {
  selectedValue: string;
  label: string;
  onSelectItem: (item: string) => void;
  options: Array<Options>;
};

function DropDown({selectedValue, label, onSelectItem, options}: Props) {
  return (
    <Select
      selectedValue={selectedValue}
      accessibilityLabel={label}
      placeholder={label}
      _selectedItem={{
        bg: 'red.300',
        endIcon: <CheckIcon size="5" />,
      }}
      mt={1}
      onValueChange={onSelectItem}>
      {options.map(item => {
        return (
          <Select.Item key={item.value} label={item.label} value={item.value} />
        );
      })}
    </Select>
  );
}

export default DropDown;
