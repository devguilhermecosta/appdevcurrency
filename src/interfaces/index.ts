export interface CoinProps {
  code: string;
  ask: string;
}

export interface CoinPickerProps {
  coins: CoinProps[];
  selectedCoin: CoinProps | null;
  changeCoin: (coin: string) => void;
}