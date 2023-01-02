import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const Categories = ({ category, setCate }) => {
  return (
    <View style={styles.categories}>
      <TouchableOpacity
        onPress={() => setCate("Study")}
        style={{
          ...styles.category,
          backgroundColor: category === "Study" ? "#d0d0d0" : "white",
        }}
      >
        <Text>Study</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setCate("Watching")}
        style={{
          ...styles.category,
          backgroundColor: category === "Watching" ? "#d0d0d0" : "white",
        }}
      >
        <Text>Watching</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setCate("Etc")}
        style={{
          ...styles.category,
          backgroundColor: category === "Etc" ? "#d0d0d0" : "white",
        }}
      >
        <Text>Etc</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  categories: {
    flex: 0.08,
    flexDirection: "row",
    width: "93%",
  },
  category: {
    flex: 1,
    border: "1px solid #333",
    borderRadius: "5px",
    backgroundColor: "#fff",
    padding: 4,
    marginTop: 6,
    marginRight: 6,
    marginLeft: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
