import { StyleSheet, View, Pressable, Modal, FlatList } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Text from "./Text";
import { ChevronDown, X } from "lucide-react-native";
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
};

type DropDownPickerSingleProps<
  TSchema extends DropDownSchema = typeof DEFAULT_SCHEMA,
> = DropDownPickerBaseProps<TSchema> & {
  multiple?: false;
  value?: DropDownItem<TSchema>[TSchema["value"]];
  setValue: (val: DropDownItem<TSchema>[TSchema["value"]]) => void;
};

type DropDownPickerMultiProps<
  TSchema extends DropDownSchema = typeof DEFAULT_SCHEMA,
> = DropDownPickerBaseProps<TSchema> & {
  multiple: true;
  value?: DropDownItem<TSchema>[TSchema["value"]][];
  setValue: (val: DropDownItem<TSchema>[TSchema["value"]][]) => void;
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
  } = props;
  const { colors } = useTheme();
  const labelKey = schema.label as TSchema["label"];
  const valueKey = schema.value as TSchema["value"];
  const [open, setOpen] = useState(false);

  const mappedMultiValues = useMemo(
    () =>
      multiple
        ? (value as DropDownItem<TSchema>[TSchema["value"]][]).map(
            (selectedValue) => {
              const matchedItem = items.find(
                (item) => item[valueKey] === selectedValue,
              );
              return {
                key: String(selectedValue),
                label: matchedItem
                  ? matchedItem[labelKey]
                  : String(selectedValue),
              };
            },
          )
        : [],
    [items, labelKey, multiple, value, valueKey],
  );

  const pressableRipple = {
    color: disabled ? "transparent" : colors.touchColor,
    foreground: true,
  };

  return (
    <>
      <View
        style={[{ backgroundColor: colors.surface }, styles.containerStyle]}
      >
        <Pressable
          style={[styles.pressableContainer]}
          android_ripple={pressableRipple}
          onPress={() => setOpen(true)}
        >
          <View
            style={{ flex: 1, flexDirection: "row", gap: 5, flexWrap: "wrap" }}
          >
            {multiple ? (
              <>
                {mappedMultiValues.map(({ key, label }) => (
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
                    >
                      <Text style={{ fontSize: 14 }}>{label}</Text>
                      <X size={14} color={colors.onBackground} />
                    </Pressable>
                  </View>
                ))}
              </>
            ) : (
              <Text>{value}</Text>
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
            style={{ borderBottomWidth: 1, borderColor: colors.onBackground }}
          >
            <IconButton
              style={{ alignSelf: "flex-end" }}
              mode="TRANSPARENT"
              icon={X}
              onPress={() => setOpen(false)}
            />
          </View>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.flatListLabel, { borderColor: colors.border }]}
                key={item[schema.value]}
                android_ripple={pressableRipple}
              >
                <Text>{item[schema.label]}</Text>
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
  },
});
