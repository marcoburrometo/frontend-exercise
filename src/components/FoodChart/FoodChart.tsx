import React from 'react';
import { useMemo, useRef, useState } from 'react';
import { ChartDataFeatureType } from '../../types/data';
import { ChartDataResponse, CommentThreadsResponse } from '../../types/remote';
import { COLORS_SET } from '../../utils/colors';
import BarChart from '../BarChart/BarChart';
import Card from '../Card/Card';
import ThreadModal, { ThreadFormData } from '../ThreadModal/ThreadModal';

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
          .filter((dt) => dt !== 'country')
          .map((k) => {
            const thread = commentsThreads?.find(
              (c) => c.chartDataPoint.feature === k && c.chartDataPoint.country === d.country
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
                    feature: k as ChartDataFeatureType
                  },
                  title: d.country + ' - ' + k + ': ' + d[k as ChartDataFeatureType]
                });
              }
            };
          })
      })) || [],
    [data, commentsThreads]
  );

  if (isLoading) {
    <div className="h-96 w-full animate-pulse bg-gray-200" />;
  }

  if (isError) {
    return (
      <div className="container mx-auto my-4" ref={containerRef}>
        <h1 className="mb-4 text-3xl font-bold">Food around Europe!</h1>
        <Card>
          <div className="h-96 w-full animate-pulse bg-gray-200" />
          <div className="mt-5 text-red-500">Error loading data 😤</div>
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
      <div className="mt-8 flex flex-wrap">
        {chartData[0]?.values.map((d, i) => (
          <div
            key={d.x}
            className="my-2 mr-4 flex items-center justify-between rounded-lg bg-gray-200 p-2 shadow-sm">
            <div className="flex items-center px-2">
              <div
                className="mr-2 h-4 w-4 rounded-full"
                style={{ backgroundColor: COLORS_SET[i] }}
              />
              <div>{d.x}</div>
            </div>
          </div>
        ))}
      </div>
      {formData && <ThreadModal {...formData} onClose={() => setFormData(undefined)} />}
    </div>
  );
}

FoodChart.defaultProps = {
  isPublic: false
};

export default FoodChart;
