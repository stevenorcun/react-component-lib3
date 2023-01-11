import React from 'react';

interface TabProps {
  state: string;
  children: React.ReactChild[] | React.ReactChildren | React.ReactElement;
}

const Tab = ({ state, children }: TabProps) => {
  return <>{children}</>;
};

export default Tab;
