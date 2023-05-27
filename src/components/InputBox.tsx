import * as React from 'react';
import {FormControl, Input, WarningOutlineIcon} from 'native-base';
import {KeyboardType} from 'react-native/types';

type Props = {
  label: string;
  placeholder: string;
  onChange: (text: string) => void;
  errorText?: string;
  isError?: boolean;
  keyboardType?: KeyboardType;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
};

function InputBox({
  label,
  placeholder,
  onChange,
  isError = false,
  errorText,
  keyboardType,
  multiline,
  numberOfLines,
  secureTextEntry = false,
}: Props) {
  return (
    <FormControl isInvalid={isError} width={'full'}>
      <FormControl.Label _text={{fontSize: 'lg'}}>{label}</FormControl.Label>
      <Input
        fontSize={'lg'}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {errorText}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}

export default InputBox;
