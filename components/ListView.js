import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { List, PaperProvider, DefaultTheme, Button } from 'react-native-paper';

const ListView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetch('https://raw.githubusercontent.com/zachvlat/powersavergr/master/components/extracted_data.json')
      .then((response) => response.json())
      .then((json) => {
        console.log('Fetched Data:', json);
        const programItems = json.filter((item) => item['Πρόγραμμα'] != null && item['Πρόγραμμα'].trim() !== '');
        setData(programItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data. Please try again later.</Text>
        <Button mode="contained" onPress={fetchData}>
          Retry
        </Button>
      </View>
    );
  }

  console.log('Filtered Data Length:', data.length);

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.scrollView}>
        {data.length > 0 ? (
          data.map((item, index) => {
            const hasYellow = item["Τιμολόγιο"] && item["Τιμολόγιο"].includes("Κίτρινο");
            const hasGreen = item["Τιμολόγιο"] && item["Τιμολόγιο"].includes("Πράσινο");
            const hasBlue = item["Τιμολόγιο"] && item["Τιμολόγιο"].includes("Μπλε");

            let borderColor = '#E3F2FD';
            if (hasYellow) {
              borderColor = 'yellow';
            } else if (hasGreen) {
              borderColor = 'green';
            } else if (hasBlue) {
              borderColor = 'blue';
            }

            return (
              <List.Item
                key={index}
                title={`Τιμή: ${item["Τελική Τιμή Ημέρας (€/kWh)"]}€/kWh`}
                description={`Πρόγραμμα: ${item["Πρόγραμμα"]}`}
                left={() => (
                  <Image
                    source={{ uri: item["Εταιρεία"] }}
                    style={styles.companyLogo}
                    accessibilityLabel={`Company logo of ${item["Πρόγραμμα"]}`}
                  />
                )}
                style={[styles.listItem, { borderColor: borderColor }]}
                titleStyle={styles.titleText}
                descriptionStyle={styles.descriptionText}
              />
            );
          })
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
    borderWidth: 4,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default ListView;
