import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { PaperProvider, DefaultTheme, Button, Card, Title, Paragraph, Chip } from 'react-native-paper';

const ListView = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    fetch('https://zvcheats.netlify.app/components/extracted_data.json')
      .then((response) => response.json())
      .then((json) => {
        const programItems = json.filter(
          (item) => item['Πρόγραμμα'] != null && item['Πρόγραμμα'].trim() !== ''
        );
        setData(programItems);
        setSortedData(programItems);
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

  const parsePrice = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(',', '.'));
  };

  const sortData = (option) => {
    setSortOption(option);

    if (option === 'asc') {
      const sorted = [...data].sort(
        (a, b) =>
          parsePrice(a["Τελική Τιμή Ημέρας (€/kWh)"]) -
          parsePrice(b["Τελική Τιμή Ημέρας (€/kWh)"])
      );
      setSortedData(sorted);
    } else if (option === 'desc') {
      const sorted = [...data].sort(
        (a, b) =>
          parsePrice(b["Τελική Τιμή Ημέρας (€/kWh)"]) -
          parsePrice(a["Τελική Τιμή Ημέρας (€/kWh)"])
      );
      setSortedData(sorted);
    } else {
      setSortedData(data);
    }
  };

  const handleCardPress = (programName) => {
    const encodedQuery = encodeURIComponent(programName);
    const url = `https://www.google.com/search?q=${encodedQuery}`;
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

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

  return (
    <PaperProvider theme={theme}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          <Chip
            selected={sortOption === 'asc'}
            onPress={() => sortData('asc')}
            style={[styles.chip, sortOption === 'asc' && styles.chipSelected]}
          >
            Sort: Low → High
          </Chip>
          <Chip
            selected={sortOption === 'desc'}
            onPress={() => sortData('desc')}
            style={[styles.chip, sortOption === 'desc' && styles.chipSelected]}
          >
            Sort: High → Low
          </Chip>
          <Chip
            selected={sortOption === null}
            onPress={() => sortData(null)}
            style={[styles.chip, sortOption === null && styles.chipSelected]}
          >
            Reset
          </Chip>
        </ScrollView>

        <View style={styles.gridContainer}>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => {
              const hasYellow = item["Τιμολόγιο"]?.includes("Κίτρινο");
              const hasGreen = item["Τιμολόγιο"]?.includes("Πράσινο");
              const hasBlue = item["Τιμολόγιο"]?.includes("Μπλε");

              let borderColor = '#E3F2FD';
              if (hasYellow) borderColor = 'yellow';
              else if (hasGreen) borderColor = 'green';
              else if (hasBlue) borderColor = 'blue';

              return (
                <Card
                  key={index}
                  style={[styles.card, { borderColor }]}
                  onPress={() => handleCardPress(item["Πρόγραμμα"])}
                >
                  <Card.Cover
                    source={{ uri: item["Εταιρεία"] }}
                    style={styles.cardImage}
                  />
                  <Card.Content>
                    <Title style={styles.titleText}>
                      {`Τιμή: ${item["Τελική Τιμή Ημέρας (€/kWh)"]}€/kWh`}
                    </Title>
                    <Paragraph style={styles.descriptionText}>
                      {`Πρόγραμμα: ${item["Πρόγραμμα"]}`}
                    </Paragraph>
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            <View style={styles.noItemsContainer}>
              <Text>No items found</Text>
            </View>
          )}
        </View>
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
  scrollContainer: {
    padding: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  chip: {
    marginRight: 10,
    backgroundColor: '#E3F2FD',
  },
  chipSelected: {
    backgroundColor: '#1E88E5',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#E3F2FD',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 3,
  },
  cardImage: {
    height: 120,
    resizeMode: 'contain',
  },
  titleText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 14,
    color: '#000000',
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
});

export default ListView;
