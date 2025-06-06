import DDP, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker';

function DropDownPicker<T extends ValueType>(props: DropDownPickerProps<T>) {

  return <DDP {...props}/>
}

export default DropDownPicker