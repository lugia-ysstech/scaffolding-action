import React from 'react';
import Theme from './actions/open-page';

export default () => {
  const Target = Theme.loadView()
  return <Target />;
};
