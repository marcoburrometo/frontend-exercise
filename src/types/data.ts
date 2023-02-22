export enum ChartDataFeature {
  HOTDOG = "hotdog",
  BURGER = "burger",
  SANDWICH = "sandwich",
  KEBAB = "kebab",
  FRIES = "fries",
  DONUT = "donut",
}

export type ChartDataFeatureType =
  | "hotdog"
  | "burger"
  | "sandwich"
  | "kebab"
  | "fries"
  | "donut";

export type Country = "FR" | "GB" | "BE" | "DE" | "ES" | "IT";

export type ChartDataPoint = {
  feature: ChartDataFeatureType;
  country: Country;
};

export type CommentThread = {
  id: string;
  commentsCount: number;
  chartDataPoint: ChartDataPoint;
};

export type Comment = {
  userName: string;
  text: string;
};

export type CommentRequest = {
  user_name: string;
  text: string;
};
