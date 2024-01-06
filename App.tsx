import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { api } from './src/components/services/api';
import { CoinProps } from './src/interfaces';
import CoinPicker from './src/components/Picker';
import Loading from './src/components/Loading';

export default function App(): React.JSX.Element {
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinProps | null>(null);
  const [quantity, setQuantity] = useState('');
  const [convertedValue, setConvertedValue] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [changeCoinLoading, setChangeCoinLoading] = useState(false);

  useEffect(() => {
    async function getCoins() {
      await api.get('all')
      .then((r) => {
        const coinsArray = [] as CoinProps[];

        Object.entries(r.data).map((item) => {
          const coin = item[1] as CoinProps;
          coinsArray.push({
            code: coin?.code,
            ask: coin?.ask,
          });
        });

        setSelectedCoin(coinsArray[0]);
        setCoins(coinsArray);
        setLoading(false);
      })
    }

    getCoins();

  }, []);

  async function changeToNewCoin(coin: string) {
    setChangeCoinLoading(true);

    await api.get(`${coin}-BRL`)
    .then(r => {
      setSelectedCoin(r.data[0]);
      setConvertedValue('');
      setQuantity('');
      setChangeCoinLoading(false);
    })
  }

  function convertValue() {
    if (!quantity || parseFloat(quantity) <= 0 || !selectedCoin) return;

    const valueToFloat = parseInt(selectedCoin?.ask);
    const total = parseFloat(quantity) * valueToFloat;

    setConvertedValue(total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }))

    Keyboard.dismiss();

  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View style={styles.container}>

      {changeCoinLoading && <Loading transparent={true}/>}

      <View style={styles.areaTitle}>
        <Text style={styles.title} >Selecione uma moeda</Text>
      </View>

      <View style={styles.areaPicker}>
        <CoinPicker
          coins={coins}
          selectedCoin={selectedCoin}
          changeCoin={(value) => {changeToNewCoin(value)}}
        />
      </View>

      <View style={styles.areaValue}>
        <Text style={styles.title}>Digite um valor para converter em (R$)</Text>
        <TextInput
          placeholder='EX: 1.50'
          value={quantity}
          onChangeText={(value) => setQuantity(value)}
          keyboardType='numeric'
        />
      </View>

      <TouchableOpacity 
        style={
          [
            styles.areaButton, 
            {backgroundColor: quantity.length !== 0 ? 'darkred' : '#ccc'}
          ]
          }
        onPress={convertValue}
        disabled={quantity.length !== 0 ? false : true}
      >
        <Text style={styles.button}>Converter</Text>
      </TouchableOpacity>

      {convertedValue && (
        <View style={styles.convertedValueArea}>
          <Text style={styles.mainText}>{quantity} {selectedCoin?.code}</Text>
          <Text style={styles.defaulText}>corresponde a</Text>
          <Text style={styles.mainText}>{convertedValue}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#121212',
  },
  areaTitle: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  title: {
    fontSize: 16,
    color: '#000',
  },
  areaPicker: {
    backgroundColor: '#fff',
    width: '90%',
  },
  areaValue: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 10,
    marginTop: 1,
  },
  areaButton: {
    width: '90%',
    backgroundColor: 'darkred',
    padding: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  button: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
  },
  convertedValueArea: {
    marginTop: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    lineHeight: 35,
    fontSize: 28,
    fontWeight: '500',
    color: '#000',
  },
  defaulText: {
    lineHeight: 35,
    color: '#000',
    fontSize: 16,
  },
})