import * as React from 'react';
import { DetailsList, IColumn, Label, StackItem, SelectionMode } from '@fluentui/react';
import { IHowardSortingHat } from '../../../../interface';

interface ISortingHatListProps {
  items: IHowardSortingHat[];
  columns: IColumn[];
  onItemInvoked: (item: IHowardSortingHat) => void;
}

const SortingHatList: React.FC<ISortingHatListProps> = (props) => {
  return (
    <StackItem>
      {props.items.length > 0 ? (
        <DetailsList
          items={props.items}
          columns={props.columns}
          setKey="set"
          selectionMode={SelectionMode.none}
          layoutMode={0} // Fixed columns layout
          selectionPreservedOnEmptyClick={true}
          ariaLabelForSelectionColumn="Toggle selection"
          checkButtonAriaLabel="select row"
          onItemInvoked={props.onItemInvoked} // Handle row click
        />
      ) : (
        <Label>No Clock In/Out data available</Label>
      )}
    </StackItem>
  );
};

export default SortingHatList;
