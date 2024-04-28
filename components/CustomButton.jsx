import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={`${containerStyles} ${
        isLoading ? "opacity-50" : ""
      } bg-secondary rounded-xl min-h-[62px] items-center justify-center`}
    >
      <Text className="text-white font-psemibold text-lg ${textStyles}">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
