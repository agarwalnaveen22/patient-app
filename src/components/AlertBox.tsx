import {AlertDialog, Button} from 'native-base';
import {ColorSchemeType} from 'native-base/lib/typescript/components/types';
import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  buttonTitle: string;
  buttonColor: ColorSchemeType;
};

const AlertBox = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  buttonTitle,
  buttonColor,
}: Props) => {
  const cancelRef = React.useRef(null);
  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}>
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>{title}</AlertDialog.Header>
        <AlertDialog.Body>{description}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              variant="unstyled"
              colorScheme="coolGray"
              onPress={onClose}
              ref={cancelRef}>
              Cancel
            </Button>
            <Button colorScheme={buttonColor} onPress={onConfirm}>
              {buttonTitle}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default AlertBox;
