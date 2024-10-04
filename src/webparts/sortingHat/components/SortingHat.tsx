import * as React from 'react';
import { useState, useEffect } from 'react';
import SortingHatButton from './component/SortingHatButton';
import SortingHatDialog from './component/DialogComponent';
import SortingHatList from './component/SortingHatList';
import { IColumn, Stack } from '@fluentui/react';
import { IHowardSortingHat } from '../../../interface';

import { format } from 'date-fns';
import { ISortingHatProps } from './ISortingHatProps';

const HowardSortingHat = (props: ISortingHatProps) => {


  const [buttonText] = useState('');
  const [isDisabled] = useState(true);
  const [HowardSortingHatItems] = useState<IHowardSortingHat[]>([]);
  const [selectedItem, setSelectedItem] = useState<IHowardSortingHat | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const getHowardSortingHatItems = async () => {
    // Fetch items logic
  };

  const RandomHouse = async () => {
    // Logic for randomizing house
  };

  const checkHouseEmpty = async () => {
    // Logic to check house
  };

  const createNewItemIfNotExist = async () => {
    // Logic to create new item if it does not exist
  };

  useEffect(() => {
    createNewItemIfNotExist();
    getHowardSortingHatItems();
    checkHouseEmpty();
  }, []);

  const columns: IColumn[] = [
    { key: 'column1', name: 'ID', fieldName: 'ID', minWidth: 50, maxWidth: 100, isResizable: true },
    { key: 'column2', name: 'FullName', fieldName: 'FullName', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column3', name: 'Email', fieldName: 'Email', minWidth: 200, maxWidth: 300, isResizable: true },
    { key: 'column4', name: 'House', fieldName: 'House', minWidth: 150, maxWidth: 250, isResizable: true },
    {
      key: 'column5',
      name: 'TimeSorting',
      fieldName: 'TimeSorting',
      minWidth: 150,
      maxWidth: 250,
      isResizable: true,
      onRender: (item) => format(new Date(item.TimeSorting), 'dd/MM/yyyy HH:mm:ss'),
    },
  ];

  return (
    <Stack>
      <SortingHatButton
        userDisplayName={props.userDisplayName}
        userDisplayEmail={props.userDisplayEmail.toString()}
        context={props.context}
        buttonText={buttonText}
        isDisabled={isDisabled}
        onClick={RandomHouse}
        onSyncClick={getHowardSortingHatItems}
      />
      <SortingHatDialog
        selectedItem={selectedItem}
        isDialogVisible={isDialogVisible}
        onClose={() => setIsDialogVisible(false)}
      />
      <SortingHatList
        items={HowardSortingHatItems}
        columns={columns}
        onItemInvoked={(item) => {
          setSelectedItem(item);
          setIsDialogVisible(true);
        }}
      />
    </Stack>
  );
};

export default HowardSortingHat;
