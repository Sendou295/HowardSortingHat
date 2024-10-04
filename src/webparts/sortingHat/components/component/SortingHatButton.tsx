import * as React from 'react';
import { DefaultButton, IconButton, Stack, StackItem } from '@fluentui/react';
import { IIconProps } from '@fluentui/react/lib/Icon';

interface ISortingHatButtonProps {
  userDisplayName: string;
  userDisplayEmail: string;
  context: any;
  buttonText: string;
  isDisabled: boolean;
  onClick: () => void;
  onSyncClick: () => void;
}

const SortingHatButton: React.FC<ISortingHatButtonProps> = (props) => {
  const emojiIcon: IIconProps = { iconName: 'SyncOccurence' };

  return (
    <Stack>
      <StackItem>
        <DefaultButton
          text={props.buttonText}
          onClick={props.onClick}
          disabled={props.isDisabled}
        />
        <IconButton iconProps={emojiIcon} aria-label="Emoji" onClick={props.onSyncClick} />
      </StackItem>
    </Stack>
  );
};

export default SortingHatButton;
