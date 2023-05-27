import * as React from 'react';
import {Box, Link, Spacer} from 'native-base';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import {Header, InputBox, Tappable} from 'components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackScreenProps<RootStackParamList, 'Login'>;
};

function Login({navigation}: Props) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isValid, setValid] = React.useState({
    email: true,
    password: true,
  });
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const onSubmit = React.useCallback(() => {
    if (formData.email === '') {
      setValid(prevState => ({
        ...prevState,
        ['email']: false,
      }));
    } else {
      setValid(prevState => ({
        ...prevState,
        ['email']: true,
      }));
    }
    if (formData.password === '') {
      setValid(prevState => ({
        ...prevState,
        ['password']: false,
      }));
    } else {
      setValid(prevState => ({
        ...prevState,
        ['password']: true,
      }));
    }

    if (formData.email !== '' && formData.password !== '') {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          setLoading(false);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Tabs'}],
            }),
          );
        })
        .catch(error => {
          setLoading(false);
          if (error.code === 'auth/user-not-found') {
            Alert.alert('Error', 'You are not registered with us!');
          } else if (error.code === 'auth/wrong-password') {
            Alert.alert('Error', 'Invalid password!');
          } else {
            Alert.alert('Error', 'Unknown Error!');
          }
          console.error(error);
        });
    }
  }, [formData.email, formData.password, navigation]);

  const onCreateAccount = React.useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  React.useEffect(() => {
    if (auth().currentUser) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Tabs'}],
        }),
      );
    }
  }, [isFocused, navigation]);

  return (
    <Box flex={1}>
      <Header text="Login" />
      <Box flex={1} alignItems={'center'} px={'12'}>
        <Box width={'full'} height={'30%'} marginTop={'1/4'}>
          <InputBox
            label={'Email Address'}
            placeholder={'Enter email address'}
            errorText={'Please enter valid email address'}
            isError={!isValid.email}
            onChange={(value: string) =>
              setFormData(prevState => ({
                ...prevState,
                ['email']: value,
              }))
            }
          />
          <Spacer />
          <InputBox
            label={'Password'}
            placeholder={'Enter password'}
            errorText={'Please enter valid password'}
            isError={!isValid.password}
            secureTextEntry={true}
            onChange={(value: string) =>
              setFormData(prevState => ({
                ...prevState,
                ['password']: value,
              }))
            }
          />
          <Spacer />
        </Box>
        <Box marginTop={'12'} width={'full'}>
          <Tappable
            isLoading={loading}
            loadingText={'Submitting'}
            text="Submit"
            onPress={onSubmit}
          />
          <Link alignSelf={'center'} mt={'10%'} onPress={onCreateAccount}>
            Create Account
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
