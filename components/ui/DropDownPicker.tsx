import DDP, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker';

function DropDownPicker<T extends ValueType>({style, ...props}: DropDownPickerProps<T>) {

  return <DDP 
    listMode='MODAL' 
    modalAnimationType='slide'
    style={[{

    }, style]} 
    {...props} />
}

export default DropDownPicker