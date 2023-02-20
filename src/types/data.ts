export enum ChartDataFeature {
  HOTDOG = "hotdog",
  BURGER = "burger",
  SANDWITCH = "sandwitch",
  KEBAB = "kebab",
  FRIES = "fries",
  DONUT = "donut",
}

export type Country = "FR" | "GB" | "BE" | "DE" | "ES" | "IT";

export type ChartDataPoint = {
  feature: ChartDataFeature;
  country: Country;
};

export type CommentThread = {
  id: string;
  comments_count: number;
  chart_data_point: ChartDataPoint[];
};

export type Comment = {
  user_name: string;
  text: string;
};
