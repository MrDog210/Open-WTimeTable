import DDP, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker';
import { useTheme } from '../../context/ThemeContext';

function DropDownPicker<T extends ValueType>({style, ...props}: DropDownPickerProps<T>) {
  const { colors, theme } = useTheme()

  return <DDP 
    listMode='MODAL' 
    modalAnimationType='slide'
    style={[{
      borderRadius: 15,
      borderWidth: 0,
      backgroundColor: colors.surface,
      minHeight: 55
    }, style]}
    textStyle={{
      color: colors.onBackground
    }}
    modalContentContainerStyle={{
      backgroundColor: colors.surface
    }}
    modalTitleStyle={{
      color: colors.onBackground,
      fontWeight: 'bold'
    }}
    badgeStyle={{
      borderRadius: 10,
      overflow: 'hidden',
      paddingHorizontal: 0,
      paddingVertical: 0
    }}
    badgeTextStyle={{
      backgroundColor: colors.surfaceVariant,
      color: colors.onSurfaceVariant,
      paddingHorizontal: 10,
      paddingVertical: 5
    }}
    badgeSeparatorStyle={{
      
    }}
    showBadgeDot={false}
    extendableBadgeContainer={true}
    theme={theme === 'dark' ? 'DARK' : 'LIGHT'}
    {...props} />
}

export default DropDownPicker