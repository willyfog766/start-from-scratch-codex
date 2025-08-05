export interface BazaarItem {
  id: string;
  quick_status: {
    buyPrice: number;
    sellPrice: number;
  };
  history: {
    time: number;
    buyPrice: number;
    sellPrice: number;
  }[];
  prediction?: {
    price: number;
    confidence: number;
  };
}
