type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddAppointment: undefined;
  Settings: undefined;
  Tabs?: {
    screen?: undefined;
  };
};

type UserData = {
  name: string;
  age: string;
  complaint: string;
  gender: 'male' | 'female';
  appointMentTime: Date;
  status?: boolean;
  uid?: string;
  fileURL?: string;
};

type File = {
  fileCopyUri: string;
  name: string;
  size: number;
  type: string;
  uri: string;
};
