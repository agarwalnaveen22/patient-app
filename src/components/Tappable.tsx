import * as React from 'react';
import {Button} from 'native-base';
import {ViewStyle} from 'react-native/types';
import {ColorType} from 'native-base/lib/typescript/components/types';

type Props = {
  text: string;
  isLoading?: boolean;
  loadingText?: string;
  onPress: () => void;
  styles?: ViewStyle;
  backgroundColor?: ColorType;
};

function Tappable({
  text,
  isLoading = false,
  loadingText,
  onPress,
  styles,
  backgroundColor,
}: Props) {
  return (
    <Button
      _pressed={{backgroundColor: `${backgroundColor}.300` || 'red.300'}}
      backgroundColor={backgroundColor || 'red.500'}
      isLoading={isLoading}
      onPress={onPress}
      style={styles}
      isLoadingText={loadingText}>
      {text}
    </Button>
  );
}

export default Tappable;
