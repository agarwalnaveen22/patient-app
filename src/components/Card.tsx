import * as React from 'react';
import {Badge, Box, HStack, Pressable, Spacer, Text} from 'native-base';

type Props = {
  onPress: () => void;
  status: string;
  time: string;
  age: string | number;
  description: string;
  gender: string;
  name: string;
};

function Card({onPress, status, time, age, description, gender, name}: Props) {
  const renderRow = React.useCallback((label: string, value: string) => {
    return (
      <Box mt={4} flexDirection={'row'}>
        <Text bold>{label}:</Text>
        <Text>{` ${value}`}</Text>
      </Box>
    );
  }, []);
  return (
    <Pressable
      onPress={onPress}
      rounded="8"
      overflow="hidden"
      borderWidth="1"
      borderColor="coolGray.300"
      shadow="3"
      bg="coolGray.100"
      p="5">
      <Box>
        <HStack alignItems="center">
          <Badge
            colorScheme={status === 'pending' ? 'orange' : 'green'}
            _text={{
              color: 'white',
            }}
            variant="solid"
            rounded="4">
            {status.toUpperCase()}
          </Badge>
          <Spacer />
          <Text fontSize={10} color="coolGray.800">
            {time.toDate().toLocaleString()}
          </Text>
        </HStack>
        {renderRow('Name', name)}
        {renderRow('Gender', gender)}
        {renderRow('Age', age)}
        {renderRow('Complaint', description)}
      </Box>
    </Pressable>
  );
}

export default Card;
