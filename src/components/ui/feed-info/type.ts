import { TOrder } from '@utils-types';

type TFeed = {
  orders?: TOrder[];
  total: number;
  totalToday: number;
  isLoading?: boolean;
  error?: string | null;
};

export type FeedInfoUIProps = {
  feed: TFeed;
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};