import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { List, PaperProvider, DefaultTheme } from 'react-native-paper';

const ListView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/zachvlat/d448960a145c30485a46f3a579bcc0f6/raw/1f987add90c426c59c1667cc5446d1912cc6910b/output.json')
      .then((response) => response.json())
      .then((json) => {
        console.log('Fetched Data:', json);
        const programItems = json.filter((item) => item.Program != null && item.Program.trim() !== '');
        setData(programItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  console.log('Filtered Data Length:', data.length);

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.scrollView}>
        {data.length > 0 ? (
          data.map((item, index) => (
            <List.Item
              key={index}
              title={`Πρόγραμμα: ${item.Program}`}
              description={`Τιμή: ${item.Price}€/kWh`}
              left={(props) => <List.Icon {...props} icon="folder" />}
              style={styles.listItem}
              titleStyle={styles.titleText}
              descriptionStyle={styles.descriptionText}
            />
          ))
        ) : (
          <View style={styles.noItemsContainer}>
            <Text>No items found</Text>
          </View>
        )}
      </ScrollView>
    </PaperProvider>
  );
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  listItem: {
    backgroundColor: '#E3F2FD',
    margin: 10,
    borderRadius: 8,
  },
  titleText: {
    color: '#000000',
    fontSize: 16,
  },
  descriptionText: {
    color: '#000000',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
});

export default ListView;
