import { StyleSheet, View, Pressable, Modal, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Text from "./Text";
import { Check, ChevronDown, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import Container from "./Container";
import IconButton from "./IconButton";

const DEFAULT_SCHEMA = { label: "label", value: "value" } as const;

type DropDownSchema = {
  label: string;
  value: string;
};

type DropDownValue = string | number;

type DropDownItem<TSchema extends DropDownSchema> = {
  [K in TSchema["label"]]: string;
} & {
  [K in TSchema["value"]]: DropDownValue;
};

type DropDownPickerBaseProps<
  TSchema extends DropDownSchema = typeof DEFAULT_SCHEMA,
> = {
  disabled?: boolean;
  placeholder?: string;
  schema?: TSchema;
  items: DropDownItem<TSchema>[];
  title?: string
};

type DropDownPickerSingleProps<
  TSchema extends DropDownSchema = typeof DEFAULT_SCHEMA,
> = DropDownPickerBaseProps<TSchema> & {
  multiple?: false;
  value?: DropDownItem<TSchema>[TSchema["value"]] | null;
  setValue: (val: DropDownItem<TSchema>[TSchema["value"]] | null) => void;
  onChangeValue?: (val: DropDownItem<TSchema>[TSchema["value"]] | null) => void;
};

type DropDownPickerMultiProps<
  TSchema extends DropDownSchema = typeof DEFAULT_SCHEMA,
> = DropDownPickerBaseProps<TSchema> & {
  multiple: true;
  value?: DropDownItem<TSchema>[TSchema["value"]][] | null;
  setValue: (val: DropDownItem<TSchema>[TSchema["value"]][] | null) => void;
  onChangeValue?: (val: DropDownItem<TSchema>[TSchema["value"]][] | null) => void;
};

type DropDownPickerProps<
  TSchema extends DropDownSchema = typeof DEFAULT_SCHEMA,
> = DropDownPickerSingleProps<TSchema> | DropDownPickerMultiProps<TSchema>;

function NewDropDownPicker<
  TSchema extends DropDownSchema = typeof DEFAULT_SCHEMA,
>(props: DropDownPickerProps<TSchema>) {
  const {
    multiple = false,
    schema = DEFAULT_SCHEMA as TSchema,
    value,
    items,
    disabled,
    placeholder,
    title
  } = props;
  const { colors } = useTheme();
  const labelKey = schema.label as TSchema["label"];
  const valueKey = schema.value as TSchema["value"];
  const [open, setOpen] = useState(false);
  const selectedValues = useMemo(
    () =>
      multiple
        ? ((value ?? []) as DropDownItem<TSchema>[TSchema["value"]][])
        : [],
    [multiple, value],
  );

  const mappedMultiValues = useMemo(
    () =>
      multiple
        ? selectedValues.map(
            (selectedValue) => {
              const matchedItem = items.find(
                (item) => item[valueKey] === selectedValue,
              );
              return {
                key: String(selectedValue),
                value: selectedValue,
                label: matchedItem
                  ? matchedItem[labelKey]
                  : String(selectedValue),
              };
            },
          )
        : [],
    [items, labelKey, multiple, selectedValues, valueKey],
  );

  const selectedSingleLabel = useMemo(() => {
    if (multiple || value == null) {
      return null;
    }

    const matchedItem = items.find((item) => item[valueKey] === value);
    return matchedItem ? matchedItem[labelKey] : String(value);
  }, [items, labelKey, multiple, value, valueKey]);

  const pressableRipple = {
    color: disabled ? "transparent" : colors.touchColor,
    foreground: true,
  };

  function isItemSelected(
    itemValue: DropDownItem<TSchema>[TSchema["value"]],
  ): boolean {
    if (multiple) {
      return selectedValues.includes(itemValue);
    }

    return value === itemValue;
  }

  function handleItemPress(itemValue: DropDownItem<TSchema>[TSchema["value"]]) {
    if (multiple) {
      const multiProps = props as DropDownPickerMultiProps<TSchema>;
      const currentValues =
        (multiProps.value ?? []) as DropDownItem<TSchema>[TSchema["value"]][];
      const nextValues = currentValues.includes(itemValue)
        ? currentValues.filter((selectedValue) => selectedValue !== itemValue)
        : [...currentValues, itemValue];

      multiProps.setValue(nextValues);
      if(multiProps.onChangeValue)
        multiProps.onChangeValue(nextValues)
      return;
    }

    const singleProps = props as DropDownPickerSingleProps<TSchema>;
    singleProps.setValue(value === itemValue ? null : itemValue);
    if(singleProps.onChangeValue)
      singleProps.onChangeValue(itemValue)
    setOpen(false);
  }

  const placeholderText = <Text style={{ fontSize: 14, color: colors.onSurface }}>{placeholder}</Text>

  return (
    <>
      <View
        style={[{ backgroundColor: disabled ? colors.surfaceVariant : colors.surface }, styles.containerStyle]}
      >
        <Pressable
          style={[styles.pressableContainer]}
          android_ripple={pressableRipple}
          disabled={disabled}
          onPress={() => setOpen(true)}
        >
          <View
            style={{ flex: 1, flexDirection: "row", gap: 5, flexWrap: "wrap" }}
          >
            {multiple ? mappedMultiValues.length === 0 ? placeholderText : (
              <>
                {mappedMultiValues.map(({ key, label, value: selectedValue }) => (
                  <View
                    key={key}
                    style={{
                      overflow: "hidden",
                      borderRadius: 8,
                    }}
                  >
                    <Pressable
                      style={{
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: colors.surfaceVariant,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                      android_ripple={pressableRipple}
                      onPress={() => handleItemPress(selectedValue)}
                    >
                      <Text style={{ fontSize: 14 }}>{label}</Text>
                      <X size={14} color={colors.onBackground} />
                    </Pressable>
                  </View>
                ))}
              </>
            ) : (
              selectedSingleLabel ? <Text>{selectedSingleLabel}</Text> : placeholderText
            )}
          </View>
          <ChevronDown color={colors.onBackground} />
        </Pressable>
      </View>
      <Modal
        visible={open}
        onRequestClose={() => setOpen(false)}
        animationType="slide"
        backdropColor={colors.background}
      >
        <Container isHeaderShown={false}>
          <View
            style={{ borderBottomWidth: 1, borderColor: colors.onBackground, flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{paddingHorizontal: 10, fontWeight: 'bold', flex: 1, paddingVertical: 5}}>{title}</Text>
            <IconButton
              mode="TRANSPARENT"
              icon={X}
              onPress={() => setOpen(false)}
            />
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item[valueKey])}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.flatListLabel, { borderColor: colors.border }]}
                android_ripple={pressableRipple}
                onPress={() => {
                  handleItemPress(item[valueKey]);
                }}
              >
                <Text style={{flex: 1}}>{item[labelKey]}</Text>
                <Check color={!isItemSelected(item[valueKey]) ? 'transparent' :colors.onBackground} />
              </Pressable>
            )}
          />
        </Container>
      </Modal>
    </>
  );
}

export default NewDropDownPicker;

const styles = StyleSheet.create({
  containerStyle: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  pressableContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 55,
  },
  flatListLabel: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
});
