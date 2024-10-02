import * as React from 'react';
//import styles from './SortingHat.module.scss';
import type { ISortingHatProps } from './ISortingHatProps';
//import { escape } from '@microsoft/sp-lodash-subset';
import { SPFI } from '@pnp/sp';
import { getSP } from '../../../pnpjsConfig';
import { IHowardSortingHat } from '../../../interface';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DefaultButton, DetailsList, Dialog, DialogFooter, DialogType, IColumn, IconButton, IIconProps, Label, PrimaryButton, SelectionMode, Stack, StackItem } from '@fluentui/react';

const HowardSortingHat = (props: ISortingHatProps) => {
  const LIST_NAME = 'Howard Sorting Hat'
  let _sp: SPFI = getSP(props.context);
  const [buttonText, setButtonText] = useState(''); // Default button text
  const [isDisabled, setIsDisabled] = useState(true); // State to control button disabled
  const [HowardSortingHatItems, setHowardSortingHatItems] = useState<IHowardSortingHat[]>([])
  const getHowardSortingHatItems = async () => {
    //createNewItemIfNotExist();
    //try {
      const items = await _sp.web.lists.getByTitle(LIST_NAME).items();
      //const items = await _sp.web.lists.getByTitle(LIST_NAME).items.filter(FullName eq '${props.userDisplayName}')();
      setHowardSortingHatItems(
        items.map((items: any) => ({
          ID: items.ID,
          FullName: items.FullName,
          Email: items.Email,
          House: items.House,
          TimeSorting: items.TimeSorting, // Ensure this is converted to Date
        })).sort((a, b) => b.ID - a.ID)
      );
      checkHouseEmpty();
    //} catch (error) {
    //  console.error('Error fetching Howard Sorting Hat items:', error);
    //}
  }
 
   // Add new item if no match for userDisplayName
   const createNewItemIfNotExist = async (): Promise<void> =>{
    const currentTime = new Date();
    const newEntry: IHowardSortingHat = {
      ID: 0,
      FullName: props.userDisplayName,
      Email: props.userDisplayEmail.toString(),
      House: '',
      TimeSorting: currentTime
    };
    try {
       //Check if userDisplayName already exists in the list
       const existingItems = await _sp.web.lists.getByTitle(LIST_NAME).items.filter(`FullName eq '${props.userDisplayName}'`)();
      if (existingItems.length === 0) {
        // No matching FullName found, create a new item
        await _sp.web.lists.getByTitle(LIST_NAME).items.add({
          FullName: newEntry.FullName,
          Email: newEntry.Email,
          House: newEntry.House, // Default or placeholder value
          TimeSorting: currentTime // Ccurrent time
        });
        getHowardSortingHatItems();
        checkHouseEmpty();
        // Fetch the updated list after adding the item
      }
    } catch (error) {
      alert(error);
    }
  };

  const CheckEmail = props.userDisplayEmail;
const checkHouseEmpty = async (): Promise<void>=>{
  const currentUserItem2 = await _sp.web.lists.getByTitle(LIST_NAME).items
  .filter(`FullName eq '${props.userDisplayName}'`)();
  const currentHouse = currentUserItem2[0].House;
  console.log(currentHouse)
  if (!currentHouse) {
    setButtonText('Random House'); // If House is empty, set button text to "Random House"
  } else {
    setButtonText('Changed House'); // Otherwise, keep it "Check and Create"
  }
}
  
    // Check email and disable button if necessary
    useEffect(() => {
      createNewItemIfNotExist();
      getHowardSortingHatItems();
      checkHouseEmpty();
      const matchedItem = HowardSortingHatItems.some(item => item.Email === CheckEmail);
      setIsDisabled(!matchedItem);
    }, []);
  
// Function to format the clock in time in the dialog

const formatTimeSorting = (TimeSortingStr: string): string => {
  const TimeSorting = new Date(TimeSortingStr);
  if (!isNaN(TimeSorting.getTime())) {
    return format(TimeSorting, 'dd/MM/yyyy HH:mm:ss');
  } else {
    return TimeSortingStr;
  }
};

const RandomHouse = async (): Promise<void> => {
  const availableHouses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];

  try {
    // Lấy House hiện tại từ SharePoint list cho user hiện tại
    const currentUserItem = await _sp.web.lists.getByTitle(LIST_NAME).items
      .filter(`FullName eq '${props.userDisplayName}'`)();

    if (currentUserItem.length > 0) {
      const currentHouse = currentUserItem[0].House;

      // Remove current house from the list of houses
      const remainingHouses = availableHouses.filter(house => house !== currentHouse);

      // Random house
      const randomIndex = Math.floor(Math.random() * remainingHouses.length);
      const newHouse = remainingHouses[randomIndex];

      // updating house in SharePoint list
      await _sp.web.lists.getByTitle(LIST_NAME).items.getById(currentUserItem[0].ID).update({
        House: newHouse
      });

      // updating house
      getHowardSortingHatItems();

      alert(`Welcome to: ${newHouse}`);
    }
  } catch (error) {
    console.error('Error updating house:', error);
  }
};

  const columns: IColumn[] = [
    { key: 'column1', name: 'ID', fieldName: 'ID', minWidth: 50, maxWidth: 100, isResizable: true },
    { key: 'column2', name: 'FullName', fieldName: 'FullName', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column3', name: 'Email', fieldName: 'Email', minWidth: 200, maxWidth: 300, isResizable: true,
      onRender: (item) => {
    if (item.Email === CheckEmail) {
      setIsDisabled(false);
    }
    return item.Email;
  },
    },
    {
      key: 'column4', name: 'House', fieldName: 'House', minWidth: 150, maxWidth: 250, isResizable: true},
    {
      key: 'column5',
      name: 'TimeSorting',
      fieldName: 'TimeSorting',
      minWidth: 150,
      maxWidth: 250,
      isResizable: true,
      onRender: (items) => {
        // Use the formatClockInTime function to format the clock-in time
        return formatTimeSorting(items.TimeSorting);
      }
    }
  ];

  //Fluent UI Dialog
  const [selectedItem, setSelectedItem] = useState<IHowardSortingHat | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const onItemInvoked = (item: IHowardSortingHat): void => {
    setSelectedItem(item);
    setIsDialogVisible(true);

  };
  // Function to close the dialog
  const closeDialog = (): void => {
    setIsDialogVisible(false);
    setSelectedItem(null);
  };

    // Find the House value of the item with the target email
    const targetHouseItem = HowardSortingHatItems.filter(item => item.Email === CheckEmail);
    const targetHouse = targetHouseItem.length > 0 ? targetHouseItem[0].House : undefined;
    
    // Filter items based on the House value of the target email
  const filteredItems = targetHouse 
  ? HowardSortingHatItems.filter(item => item.House === targetHouse) 
  : HowardSortingHatItems; // Nếu House trống, hiển thị tất cả

  const emojiIcon: IIconProps = { iconName: 'SyncOccurence' };
  
  return (
    <Stack>
      <StackItem>Hello, {[props.userDisplayName]}</StackItem>
      <StackItem>Email, {[props.userDisplayEmail]}</StackItem>
      {/* Button to check and create new item */}
      
      <StackItem>
        <DefaultButton
          text={buttonText}
          onClick={RandomHouse}
          disabled={isDisabled}
        />
        <IconButton iconProps={emojiIcon} aria-label="Emoji" onClick={getHowardSortingHatItems} />
      </StackItem>
      <StackItem>
        <Dialog
          hidden={!isDialogVisible}
          onDismiss={closeDialog}
          dialogContentProps={{
            type: DialogType.largeHeader,
            title: selectedItem ? selectedItem.FullName : '',
            subText: selectedItem ? selectedItem.Email : ''
          }}
        >
           <StackItem>
          <Label>House: {[selectedItem?.House]}</Label>
          </StackItem>
          <DialogFooter>
            <PrimaryButton onClick={closeDialog} text="Close" />
          </DialogFooter>
        </Dialog>
      </StackItem>
      <StackItem>
        {filteredItems.length > 0 ? (
          <DetailsList
            items={filteredItems}
            columns={columns}
            setKey="set"
            selectionMode={SelectionMode.none}
            layoutMode={0} // Fixed columns layout
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            checkButtonAriaLabel="select row"
            onItemInvoked={onItemInvoked} // Handle row click
          />
        ) : (
          <Label>No Clock In/Out data available</Label>
        )}
      </StackItem>
    </Stack>
  )
}
export default HowardSortingHat