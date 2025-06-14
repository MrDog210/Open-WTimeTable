import DDP, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker';

function DropDownPicker<T extends ValueType>({style, ...props}: DropDownPickerProps<T>) {

  return <DDP 
    listMode='MODAL' 
    modalAnimationType='slide'
    style={[{

    }, style]}
    showBadgeDot={false}
    extendableBadgeContainer={true}
    {...props} />
}

export default DropDownPicker