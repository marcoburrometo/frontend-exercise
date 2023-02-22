import React from 'react';
import 'whatwg-fetch';
import { fireEvent, render, waitFor } from '@testing-library/react';
import App from './App';
import fetchMock from 'jest-fetch-mock';
import chartData from './__mocks__/chartData';
import commentThreads from './__mocks__/commentThreads';
import commentThread from './__mocks__/commentThread';

beforeAll(() => {
  // Mock remote data
  fetchMock.mockIf(/http:\/\/localhost\/*/, (req) => {
    if (req.url.endsWith('/chart/data')) {
      return Promise.resolve({
        body: JSON.stringify(chartData)
      });
    } else if (req.url.endsWith('/chart/comment_threads')) {
      return Promise.resolve({
        body: JSON.stringify(commentThreads)
      });
    } else if (
      req.url === 'http://localhost:8000/chart/comment_threads/4a905c4edd684130b8b57886fdacf20a'
    ) {
      return Promise.resolve({
        body: JSON.stringify(commentThread)
      });
    }
    return Promise.resolve({
      body: JSON.stringify({})
    });
  });

  fetchMock.enableMocks();
});

test('renders the app without errors', async () => {
  const { getByText, container } = render(<App />);
  expect(getByText('Food around Europe!')).toBeTruthy();
  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(getByText('hotdog')).toBeTruthy();
  });
  expect(container).toMatchSnapshot();

  // Click on a data point with comments
  const dataPoint = container.querySelectorAll('.bar.clickable')[7];
  fireEvent.click(dataPoint);
  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
  expect(getByText('GB - burger: 74')).toBeTruthy();
  expect(getByText('Comments: 2')).toBeTruthy();
});
