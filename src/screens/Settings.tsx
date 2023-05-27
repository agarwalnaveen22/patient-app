import * as React from 'react';
import {Box} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import {Header, Tappable} from 'components';

type Props = {
  navigation: NativeStackScreenProps<RootStackParamList, 'Tabs'>;
};

function Settings({navigation}: Props) {
  const onLogout = React.useCallback(() => {
    auth()
      .signOut()
      .then(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      });
  }, [navigation]);
  return (
    <Box flex={1}>
      <Header text="Settings" />
      <Box mx={4} my={4}>
        <Tappable text={'Logout'} onPress={onLogout} />
      </Box>
    </Box>
  );
}

export default Settings;
