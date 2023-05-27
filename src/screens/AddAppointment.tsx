import * as React from 'react';
import {
  Alert,
  Box,
  FormControl,
  ScrollView,
  Text,
  WarningOutlineIcon,
} from 'native-base';
import {Alert as NativeAlert, Platform} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import DatePicker from 'react-native-date-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Config from 'react-native-config';
import {DropDown, Header, InputBox, Tappable} from 'components';
import {postRequest} from 'services/api';

type Props = {
  navigation: NativeStackScreenProps<RootStackParamList, 'Tabs'>;
};

const GenderOptions = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
];

function AddAppointment({navigation}: Props) {
  const [selectedGender, setSelectedGender] =
    React.useState<UserData<'gender'>>('');
  const [selectedAppointmentTime, setAppointmentTime] = React.useState<Date>(
    new Date(),
  );
  const [openPicker, setOpenPicker] = React.useState<boolean>(false);
  const [fileResponse, setFileResponse] = React.useState<File>();
  const [isError, setError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isValid, setValid] = React.useState({
    name: true,
    age: true,
    gender: true,
    complaint: true,
  });
  const [formData, setFormData] = React.useState({
    name: '',
    age: '',
    gender: selectedGender,
    complaint: '',
  });

  const onUploadAttachmentClick = React.useCallback(async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [types.pdf, types.images],
        copyTo: 'cachesDirectory',
      });
      setFileResponse(response);
    } catch (err) {
      setError(true);
      setErrorMessage(err?.message);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  }, []);

  const onSendEmail = React.useCallback(async (userData: UserData) => {
    try {
      const request = {
        personalizations: [
          {
            to: [
              {
                email: 'doctor@mailinator.com',
                name: 'Doctor',
              },
            ],
            subject: 'New appointment created!',
          },
        ],
        content: [
          {
            type: 'text/plain',
            value: `New appointment created with following details: \n \n Name: ${userData.name}\n Age: ${userData.age}\n Complaint: ${userData.complaint}\n Appointment Time: ${userData.appointMentTime}\n Gender: ${userData.gender}\n Prescription File: ${userData.fileURL}`,
          },
        ],
        from: {
          email: 'agarwalnaveen22@gmail.com',
          name: 'Naveen Agarwal',
        },
      };
      await postRequest('https://api.sendgrid.com/v3/mail/send', request, {
        headers: {
          Authorization: `Bearer ${Config.EMAIL_API_KEY}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const onSubmit = React.useCallback(() => {
    setValid(prevState => ({
      ...prevState,
      ['name']: true,
      ['age']: true,
      ['gender']: true,
      ['complaint']: true,
      ['attachment']: true,
    }));
    setError(false);
    if (formData.name === '') {
      setValid(prevState => ({
        ...prevState,
        ['name']: false,
      }));
    }
    if (formData.age === '') {
      setValid(prevState => ({
        ...prevState,
        ['age']: false,
      }));
    }
    if (selectedGender === '') {
      setValid(prevState => ({
        ...prevState,
        ['gender']: false,
      }));
    }
    if (formData.complaint === '') {
      setValid(prevState => ({
        ...prevState,
        ['complaint']: false,
      }));
    }
    if (fileResponse?.size <= 0) {
      setError(true);
      setErrorMessage('Please attach prescription file');
    }
    if (
      isValid.name &&
      isValid.age &&
      isValid.complaint &&
      isValid.gender &&
      selectedGender !== '' &&
      fileResponse?.size > 0
    ) {
      setLoading(true);
      const user = auth().currentUser;
      const filename = fileResponse?.name;
      const uploadUri = fileResponse?.fileCopyUri.replace('file://', '');
      if (uploadUri) {
        storage()
          .ref(`/files/${filename}`)
          .putFile(uploadUri)
          .then(data => {
            firestore()
              .collection('Appointments')
              .add({
                name: formData.name,
                age: formData.age,
                complaint: formData.complaint,
                gender: selectedGender,
                appointMentTime: selectedAppointmentTime,
                filePath: data.metadata.fullPath,
                status: 'pending',
                uid: user?.uid,
              })
              .then(() => {
                setLoading(false);
                storage()
                  .ref(data.metadata.fullPath)
                  .getDownloadURL()
                  .then(data => {
                    onSendEmail({
                      name: formData.name,
                      age: formData.age,
                      complaint: formData.complaint,
                      gender: selectedGender,
                      appointMentTime: selectedAppointmentTime,
                      fileURL: data,
                    });
                  });
                NativeAlert.alert(
                  'Success',
                  'Appointment has been succesfully created. You will get notified once it is updated',
                );
                navigation.goBack();
              })
              .catch(error => {
                setLoading(false);
                console.log(error);
                NativeAlert.alert(
                  'Error',
                  'Something is wrong during creating appointments, please try to again later.',
                );
              });
          })
          .catch(error => {
            setLoading(false);
            NativeAlert.alert(
              'Error',
              'Something is wrong during creating appointments, please try to again later.',
            );
            console.error(error);
          });
      }
    }
  }, [
    fileResponse?.fileCopyUri,
    fileResponse?.name,
    fileResponse?.size,
    formData.age,
    formData.complaint,
    formData.name,
    isValid.age,
    isValid.complaint,
    isValid.gender,
    isValid.name,
    navigation,
    onSendEmail,
    selectedAppointmentTime,
    selectedGender,
  ]);

  const renderSpacer = React.useMemo(() => {
    return <Box my={'2'} />;
  }, []);
  return (
    <ScrollView flex={1}>
      <Header text="Add Appointment" isBack />
      <Box px={8}>
        <InputBox
          errorText={'Please enter your name'}
          isError={!isValid.name}
          onChange={(value: string) =>
            setFormData(prevState => ({
              ...prevState,
              ['name']: value,
            }))
          }
          label="Name"
          placeholder="Enter your name"
        />
        {renderSpacer}
        <InputBox
          label="Age"
          placeholder="Enter your age"
          keyboardType="number-pad"
          errorText={'Please enter your age'}
          isError={!isValid.age}
          onChange={(value: string) =>
            setFormData(prevState => ({
              ...prevState,
              ['age']: value,
            }))
          }
        />
        {renderSpacer}
        <DropDown
          label="Choose Gender"
          options={GenderOptions}
          selectedValue={selectedGender}
          onSelectItem={setSelectedGender}
        />
        <FormControl isInvalid={!isValid.gender} width={'full'}>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {'Please choose your gender'}
          </FormControl.ErrorMessage>
        </FormControl>
        {renderSpacer}
        <InputBox
          label="Complaint"
          placeholder="Enter your complaint"
          multiline
          numberOfLines={5}
          errorText={'Please enter your complaint'}
          isError={!isValid.complaint}
          onChange={(value: string) =>
            setFormData(prevState => ({
              ...prevState,
              ['complaint']: value,
            }))
          }
        />
        {renderSpacer}
        <Tappable
          text={'Upload Prescription File'}
          styles={{borderRadius: 20}}
          backgroundColor={'orange.500'}
          onPress={onUploadAttachmentClick}
        />
        {fileResponse?.size > 0 && (
          <Box
            mt={4}
            borderWidth={1}
            borderStyle={'dashed'}
            minHeight={12}
            alignItems={'center'}
            justifyContent={'center'}>
            <Text ellipsizeMode={'middle'}>{fileResponse?.name}</Text>
          </Box>
        )}
        {isError && (
          <>
            {renderSpacer}
            <Alert flexDirection={'row'} alignItems="center" status="error">
              <Alert.Icon ml={2} />
              <Text ml={2} color="error.600" fontWeight="medium">
                {errorMessage}
              </Text>
            </Alert>
          </>
        )}

        {renderSpacer}
        <Box
          mt={4}
          borderWidth={1}
          borderStyle={'dashed'}
          height={12}
          flexDirection={'row'}
          alignItems={'center'}
          px={'2'}
          justifyContent={'space-between'}>
          <Text>{selectedAppointmentTime.toLocaleString()}</Text>
          <Tappable
            text={'Choose Appointment'}
            onPress={() => setOpenPicker(true)}
            styles={{width: 160, height: 40}}
            backgroundColor={'orange.500'}
          />
        </Box>
        {renderSpacer}
        <DatePicker
          modal
          open={openPicker}
          date={selectedAppointmentTime}
          onConfirm={date => {
            setOpenPicker(false);
            setAppointmentTime(date);
          }}
          onCancel={() => {
            setOpenPicker(false);
          }}
        />
        {renderSpacer}
        <Tappable
          isLoading={loading}
          loadingText="Submitting"
          text={'Submit'}
          onPress={onSubmit}
        />
        {renderSpacer}
      </Box>
    </ScrollView>
  );
}

export default AddAppointment;
