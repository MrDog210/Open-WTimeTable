import DDP, { DropDownPickerProps, RenderBadgeItemPropsInterface, ValueType } from 'react-native-dropdown-picker-plus';
import { Text as RNText, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

function DropDownPicker<T extends ValueType>({style, ...props}: DropDownPickerProps<T>) {
  const { colors, theme } = useTheme()

  function removeBadgeValue(value: T) {
    if (!('setValue' in props) || typeof props.setValue !== 'function')
      return

    ;(props.setValue as any)((state: T[] | null) => {
      if (!Array.isArray(state))
        return state
      return state.filter((selectedValue) => selectedValue !== value)
    })
  }

  function defaultRenderBadgeItem(badgeProps: RenderBadgeItemPropsInterface<T>) {
    return (
      <TouchableOpacity
        style={[
          badgeProps.badgeStyle,
          { backgroundColor: badgeProps.getBadgeColor(`${badgeProps.value}`) }
        ]}
        {...badgeProps.props}
        onPress={() => removeBadgeValue(badgeProps.value)}
      >
        {badgeProps.showBadgeDot && (
          <View
            style={[
              badgeProps.badgeDotStyle,
              { backgroundColor: badgeProps.getBadgeDotColor(`${badgeProps.value}`) }
            ]}
          />
        )}
        <RNText style={[badgeProps.textStyle, badgeProps.badgeTextStyle]}>
          {badgeProps.label}
        </RNText>
      </TouchableOpacity>
    )
  }

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
    containerStyle={{
      //backgroundColor: 'red'
    }}
    modalContentContainerStyle={{
      //backgroundColor: 'red'
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
    flatListProps={{
      style: {
      //backgroundColor: 'red'

      }
    }}
    disabledItemLabelStyle={{
      //color: 'red'
    }}
    disabledStyle={{
      backgroundColor: colors.border
    }}
    disabledItemContainerStyle={{
      
    }}
    showBadgeDot={false}
    extendableBadgeContainer={true}
    theme={theme === 'dark' ? 'DARK' : 'LIGHT'}
    {...props}
    renderBadgeItem={props.renderBadgeItem ?? (props.multiple ? defaultRenderBadgeItem : undefined)} />
}

export default DropDownPicker