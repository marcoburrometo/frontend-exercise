export enum ChartDataFeature {
  HOTDOG = "hotdog",
  BURGER = "burger",
  SANDWICH = "sandwich",
  KEBAB = "kebab",
  FRIES = "fries",
  DONUT = "donut",
}

type ChartDAtaFeatureType =
  | "hotdog"
  | "burger"
  | "sandwich"
  | "kebab"
  | "fries"
  | "donut";

export type Country = "FR" | "GB" | "BE" | "DE" | "ES" | "IT";

export type ChartDataPoint = {
  feature: ChartDAtaFeatureType;
  country: Country;
};

export type CommentThread = {
  id: string;
  commentsCount: number;
  chartDataPoint: ChartDataPoint;
};

export type Comment = {
  user_name: string;
  text: string;
};
