import React from 'react';
import { render } from 'utils/setup-tests';
import Loading from './loading';

describe('<Loading/>', () => {
  it('should render children and loading animation', () => {
    const { container, getByText } = render(<Loading>TESTING</Loading>);

    const testEl = getByText(/TESTING/gi);
    expect(testEl).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot', () => {
    const { container } = render(<Loading />);

    expect(container).toMatchSnapshot();
  });
});
