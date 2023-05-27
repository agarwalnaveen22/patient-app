import * as React from 'react';
import {Box, FormControl, Spacer, WarningOutlineIcon} from 'native-base';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {DropDown, Header, InputBox, Tappable} from 'components';

type Props = {
  navigation: NativeStackScreenProps<RootStackParamList, 'Register'>;
};

const Options = [
  {
    label: 'Patient',
    value: 'patient',
  },
  {
    label: 'Doctor',
    value: 'doctor',
  },
];

function Register({navigation}: Props) {
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isValid, setValid] = React.useState({
    email: true,
    password: true,
    confirmPassword: true,
    userType: true,
  });
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: selectedType,
  });

  const requestUserPermission = React.useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          return authStatus;
        }
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  }, []);

  const onSubmit = React.useCallback(async () => {
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

    if (formData.confirmPassword === '') {
      setValid(prevState => ({
        ...prevState,
        ['confirmPassword']: false,
      }));
    } else {
      setValid(prevState => ({
        ...prevState,
        ['confirmPassword']: true,
      }));
    }

    if (selectedType === '') {
      setValid(prevState => ({
        ...prevState,
        ['userType']: false,
      }));
    } else {
      setValid(prevState => ({
        ...prevState,
        ['userType']: true,
      }));
    }

    if (
      formData.email !== '' &&
      formData.password !== '' &&
      formData.confirmPassword !== '' &&
      selectedType !== ''
    ) {
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Both passwords does not matched.');
      } else {
        try {
          let deviceToken = '';
          const permissionStatus = await requestUserPermission();
          if (permissionStatus) {
            await messaging().registerDeviceForRemoteMessages();
            deviceToken = await messaging().getToken();
          }
          setLoading(true);
          auth()
            .createUserWithEmailAndPassword(formData.email, formData.password)
            .then(data => {
              firestore()
                .collection('Users')
                .add({
                  email: data.user.email,
                  uid: data.user.uid,
                  userType: selectedType,
                  deviceToken,
                })
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
                  console.log(error);
                  Alert.alert(
                    'Error',
                    'Something is wrong during signup, please try to login with this account.',
                  );
                  auth()
                    .signOut()
                    .finally(() => {
                      navigation.goBack();
                    });
                });
            })
            .catch(error => {
              setLoading(false);
              if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'That email address is already in use!');
              } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'That email address is invalid!');
              } else {
                Alert.alert('Error', 'Unknown Error!');
              }
              console.error(error);
            });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [
    formData.confirmPassword,
    formData.email,
    formData.password,
    navigation,
    requestUserPermission,
    selectedType,
  ]);

  return (
    <Box flex={1}>
      <Header text="Register" isBack />
      <Box flex={1} alignItems={'center'} px={'12'}>
        <Box width={'full'} height={'65%'} marginTop={'1/4'}>
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
          <InputBox
            label={'Confirm Password'}
            placeholder={'Enter password again'}
            errorText={'Please enter valid password again'}
            isError={!isValid.confirmPassword}
            secureTextEntry={true}
            onChange={(value: string) =>
              setFormData(prevState => ({
                ...prevState,
                ['confirmPassword']: value,
              }))
            }
          />
          <Spacer />
          <DropDown
            label="Choose User Type"
            options={Options}
            selectedValue={selectedType}
            onSelectItem={setSelectedType}
          />
          <FormControl isInvalid={!isValid.userType} width={'full'}>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}>
              {'Please choose your user type'}
            </FormControl.ErrorMessage>
          </FormControl>
          <Spacer />
          <Tappable
            isLoading={loading}
            loadingText={'Submitting'}
            text="Submit"
            onPress={onSubmit}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
