import React, { useState, useEffect } from "react";

import TabNav from "./TabNav";

interface TabElementProps {
  state: string | undefined;
  navigation: string | undefined;
  children: React.ReactChild[] | React.ReactChildren | React.ReactElement;
}

const TabElement = ({ state, navigation, children }: TabElementProps) => {
  return <>{state === navigation && children}</>;
};

interface TabsProps {
  className?: string;
  classNamePrefix?: string;
  defaultActive?: string;
  active?: string;
  tabs: {
    key: string;
    title: string | React.ReactElement;
  }[];
  children?: React.ReactNode;
}

const defaultProps = {
  className: "",
  classNamePrefix: undefined,
  defaultActive: "",
  active: undefined,
  children: undefined,
};

const Tabs = ({
  className,
  classNamePrefix,
  defaultActive,
  active,
  tabs,
  children,
}: TabsProps) => {
  const [navigation, setNavigation] = useState(defaultActive);
  useEffect(() => {
    if (active !== undefined) {
      setNavigation(active);
    }
  }, [active]);
  return (
    <>
      <TabNav
        className={className}
        classNamePrefix={classNamePrefix}
        navigation={navigation}
        setNavigation={setNavigation}
        tabs={tabs}
      />
      {React.Children.map(children, (child) => (
        // @ts-ignore
        <TabElement state={child?.props.state} navigation={navigation}>
          {
            // @ts-ignore
            child?.props.children
          }
        </TabElement>
      ))}
    </>
  );
};

Tabs.defaultProps = defaultProps;

export default Tabs;
