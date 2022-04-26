import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import FIcons from 'react-native-vector-icons/Feather';

const apiUrl =
  'https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=demo';
const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [dataArray, setData] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetch(apiUrl)
      .then(results => results.text())
      .then(response => {
        const jsonData = csvToJSON(response);
        setLoading(false);
        setData(jsonData);
      })
      .catch(() => {
        setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const csvToJSON = csv => {
    var lines = csv.split('\n');

    var result = [];

    var headers = lines[0].split(',');

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(',');

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    return result;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          size={'large'}
          color={'#40C7C0'}
        />
      ) : (
        <FlatList
          data={dataArray}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View key={index.toString()}>
                <View style={styles.itemContainer}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      resizeMode="contain"
                      style={styles.image}
                      source={{
                        uri: `https://storage.googleapis.com/iex/api/logos/${item?.symbol}.png`,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 4,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View style={{flex: 3, marginHorizontal: 10}}>
                      <Text style={styles.headingText}>{item?.symbol}</Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 16,
                        }}>
                        {item?.name}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{
                          ...styles.headingText,
                          flex: 1,
                        }}>
                        ${item?.price}
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginHorizontal: 10,
                            alignItems: 'center',
                          }}>
                          <FIcons name="arrow-down" size={14} color={'red'} />
                          <Text style={styles.warningText}>
                            {item?.lowPrice}
                          </Text>
                        </View>
                        <Text style={styles.warningText}>{item?.high}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.separator} />
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: 400 / 2,
    borderWidth: 4,
    borderColor: '#eee',
    margin: 5,
  },
  headingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 8,
    borderWidth: 0.7,
    borderColor: '#eee',
  },
  warningText: {
    color: 'red',
  },
});
export default App;
