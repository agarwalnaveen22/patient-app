import * as React from 'react';
import {ArrowBackIcon, Box, Heading, Pressable} from 'native-base';
import {useNavigation} from '@react-navigation/native';

type Props = {
  text: string;
  isBack?: boolean;
  isRightIcon?: React.ReactNode;
};

function Header({text, isBack, isRightIcon}: Props) {
  const navigation = useNavigation();
  return (
    <Box
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      width={'full'}
      height={'10'}
      backgroundColor={'red.500'}>
      <Pressable
        onPress={navigation.goBack}
        width={'50'}
        justifyContent={'center'}
        alignItems={'center'}>
        {isBack && <ArrowBackIcon color="white" />}
      </Pressable>
      <Heading color={'white'}>{text}</Heading>
      <Box width={'50'} justifyContent={'center'} alignItems={'center'}>
        {isRightIcon}
      </Box>
    </Box>
  );
}

export default Header;
