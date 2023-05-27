import * as React from 'react';
import {AddIcon, Box, FlatList, Pressable, Spinner} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {Header, Card, AlertBox} from 'components';
import {postRequest} from 'services/api';
import Config from 'react-native-config';

type Props = {
  navigation: NativeStackScreenProps<RootStackParamList, 'Tabs'>;
};

function Home({navigation}: Props) {
  const isFocused = useIsFocused();
  const [appointments, setAppointments] = React.useState([]);
  const [showConfirmBox, setShowConfirmBox] = React.useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] =
    React.useState<string>('');
  const [user, setUser] = React.useState();
  const getAppointmentList = React.useCallback(() => {
    firestore()
      .collection('Users')
      .where('uid', '==', auth().currentUser.uid)
      .get()
      .then(data => {
        setUser(data.docs[0]);
        if (data.docs[0]._data.userType === 'doctor') {
          firestore()
            .collection('Appointments')
            .orderBy('appointMentTime', 'desc')
            .get()
            .then(data => {
              setAppointments(data.docs);
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          firestore()
            .collection('Appointments')
            .where('uid', '==', auth().currentUser.uid)
            .orderBy('appointMentTime', 'desc')
            .get()
            .then(data => {
              setAppointments(data.docs);
            })
            .catch(error => {
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  const sendPushNotification = React.useCallback(async () => {
    try {
      const request = {
        data: {
          type: 'appointments',
        },
        to: user?._data?.deviceToken,
        priority: 'high',
        notification: {
          body: 'Appointment Confirmed!',
          title: 'Your appointment has been confirmed',
        },
      };
      await postRequest('https://fcm.googleapis.com/fcm/send', request, {
        headers: {
          Authorization: `key=${Config.FCM_API_KEY}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [user]);
  const makeConfirmAppointment = React.useCallback(() => {
    firestore()
      .collection('Appointments')
      .doc(currentAppointment.id)
      .update({
        status: 'confirmed',
      })
      .then(() => {
        setShowConfirmBox(false);
        getAppointmentList();
        sendPushNotification();
      })
      .catch(error => {
        console.error(error);
      });
  }, [currentAppointment.id, getAppointmentList, sendPushNotification]);
  const showConfirmAppointment = React.useCallback(data => {
    setShowConfirmBox(true);
    setCurrentAppointment(data);
  }, []);
  const renderCard = React.useCallback(
    ({item}) => {
      return (
        <Card
          status={item._data.status}
          time={item._data.appointMentTime}
          age={item._data.age}
          description={item._data.complaint}
          name={item._data.name}
          gender={item._data.gender}
          onPress={() =>
            item._data.status === 'pending' &&
            user?._data?.userType === 'doctor'
              ? showConfirmAppointment(item)
              : null
          }
        />
      );
    },
    [showConfirmAppointment, user?._data?.userType],
  );
  const renderSeparator = React.useCallback(() => {
    return <Box my={2} />;
  }, []);
  const renderAddIcon = React.useMemo(() => {
    if (user?._data?.userType === 'patient') {
      return (
        <Pressable
          onPress={() =>
            navigation.navigate('AppointmentRoute', {screen: 'AddAppointment'})
          }
          width={'50'}
          justifyContent={'center'}
          alignItems={'center'}>
          <AddIcon color="white" />
        </Pressable>
      );
    }
    return null;
  }, [navigation, user]);

  React.useEffect(() => {
    getAppointmentList();
  }, [getAppointmentList, isFocused]);

  return (
    <Box flex={1}>
      <>
        <Header
          text={
            user?._data?.userType === 'patient'
              ? 'My Appointments'
              : 'All Appointments'
          }
          isRightIcon={renderAddIcon}
        />
        <Box px={4} mt={2} mb={12}>
          <FlatList
            data={appointments}
            renderItem={renderCard}
            ItemSeparatorComponent={renderSeparator}
          />
        </Box>
        <AlertBox
          isOpen={showConfirmBox}
          title={'Confirm Appointment?'}
          description={
            'Do you really would like to confirm this appointment? This action is not reviersible.'
          }
          buttonTitle={'Confirm'}
          buttonColor={'red'}
          onClose={() => setShowConfirmBox(false)}
          onConfirm={makeConfirmAppointment}
        />
      </>
    </Box>
  );
}

export default Home;
