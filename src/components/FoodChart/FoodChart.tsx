import React from "react";
import { useMemo, useRef, useState } from "react";
import { ChartDataFeatureType } from "../../types/data";
import { ChartDataResponse, CommentThreadsResponse } from "../../types/remote";
import { COLORS_SET } from "../../utils/colors";
import BarChart from "../BarChart/BarChart";
import Card from "../Card/Card";
import ThreadModal, { ThreadFormData } from "../ThreadModal/ThreadModal";

type Props = {
  data?: ChartDataResponse;
  commentsThreads?: CommentThreadsResponse;
  isPublic?: boolean;
  isLoading: boolean;
  isError: boolean;
};

function FoodChart({ data, commentsThreads, isLoading, isError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ThreadFormData>();

  const chartData = useMemo(
    () =>
      data?.map((d) => ({
        label: d.country,
        values: Object.keys(d)
          .filter((d) => d !== "country")
          .map((k) => {
            const thread = commentsThreads?.find(
              (c) =>
                c.chartDataPoint.feature === k &&
                c.chartDataPoint.country === d.country
            );
            return {
              x: k,
              y: d[k as ChartDataFeatureType],
              counter: thread?.commentsCount,
              onClick: () => {
                setFormData({
                  threadId: thread?.id,
                  dataPoint: {
                    country: d.country,
                    feature: k as ChartDataFeatureType,
                  },
                  title:
                    d.country + " - " + k + ": " + d[k as ChartDataFeatureType],
                });
              },
            };
          }),
      })) || [],
    [data, commentsThreads]
  );

  if (isLoading) {
    <div className="h-96 w-full bg-gray-200 animate-pulse" />;
  }

  if (isError) {
    return (
      <div className="container mx-auto my-4" ref={containerRef}>
        <h1 className="text-3xl font-bold mb-4">Food around Europe!</h1>
        <Card>
          <div className="h-96 w-full bg-gray-200 animate-pulse" />
          <div className="text-red-500 mt-5">Error loading data 😤</div>
        </Card>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <BarChart
        width={(containerRef.current?.clientWidth || 960) - 40}
        height={400}
        data={chartData}
      />
      <div className="flex flex-wrap mt-8">
        {chartData[0]?.values.map((d, i) => (
          <div
            key={d.x}
            className="flex items-center justify-between p-2 my-2 mr-4 bg-gray-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center px-2">
              <div
                className="w-4 h-4 mr-2 rounded-full"
                style={{ backgroundColor: COLORS_SET[i] }}
              />
              <div>{d.x}</div>
            </div>
          </div>
        ))}
      </div>
      {formData && (
        <ThreadModal {...formData} onClose={() => setFormData(undefined)} />
      )}
    </div>
  );
}

FoodChart.defaultProps = {
  isPublic: false,
};

export default FoodChart;
