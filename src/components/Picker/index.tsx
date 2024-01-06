import React from "react";
import { Picker } from "@react-native-picker/picker";
import { CoinPickerProps } from "../../interfaces";

export default function CoinPicker(props: CoinPickerProps): React.JSX.Element {
  const coinsItems = props.coins.map(coin => {
    return <Picker.Item key={coin.code} value={coin.code} label={coin.code}/>
  })

  return (
    <Picker
      selectedValue={props.selectedCoin?.code}
      onValueChange={(value) => props.changeCoin(value)}
    >
      {coinsItems}
    </Picker>
  )
}