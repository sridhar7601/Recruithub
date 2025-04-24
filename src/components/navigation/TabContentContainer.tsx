import React from 'react';

interface TabContentContainerProps {
  activeTabId: string;
  tabId: string;
  children: React.ReactNode;
}

const TabContentContainer: React.FC<TabContentContainerProps> = ({
  activeTabId,
  tabId,
  children
}) => {
  if (activeTabId !== tabId) {
    return null;
  }

  return <div className="py-4">{children}</div>;
};

export default TabContentContainer;