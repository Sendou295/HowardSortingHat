import * as React from 'react';
import { Dialog, DialogFooter, DialogType, Label, PrimaryButton, StackItem } from '@fluentui/react';
import { IHowardSortingHat } from '../../../../interface';


interface ISortingHatDialogProps {
  selectedItem: IHowardSortingHat | null;
  isDialogVisible: boolean;
  onClose: () => void;
}

const SortingHatDialog: React.FC<ISortingHatDialogProps> = (props) => {
  return (
    <Dialog
      hidden={!props.isDialogVisible}
      onDismiss={props.onClose}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: props.selectedItem ? props.selectedItem.FullName : '',
        subText: props.selectedItem ? props.selectedItem.Email : '',
      }}
    >
      <StackItem>
        <Label>House: {props.selectedItem?.House}</Label>
      </StackItem>
      <DialogFooter>
        <PrimaryButton onClick={props.onClose} text="Close" />
      </DialogFooter>
    </Dialog>
  );
};

export default SortingHatDialog;
