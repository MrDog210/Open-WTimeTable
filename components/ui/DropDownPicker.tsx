import DDP, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker';
import { useTheme } from 'react-native-paper';

function DropDownPicker<T extends ValueType>({style, ...props}: DropDownPickerProps<T>) {
  const {roundness, colors, dark} = useTheme()
  return <DDP 
    listMode='MODAL' 
    modalAnimationType='slide'
    containerStyle={{
      borderRadius: 20, borderWidth: 0,
    }}
    showBadgeDot={false}
    extendableBadgeContainer={true}
    style={[{
      borderRadius: roundness
    }, style]}
    theme={dark ? 'DARK' : 'LIGHT'}
    {...props} />
}

export default DropDownPicker