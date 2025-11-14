import React from "react";
import { View, StyleSheet } from "react-native";

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${progress * 100}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10
  },
  bar: {
    height: '100%',
    backgroundColor: '#00acc1'
  }
});

export default ProgressBar;
