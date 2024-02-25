import {Box, ListItem, UnorderedList} from "@chakra-ui/react";
import React, {ReactElement} from "react";

interface TabProps {
  label: string;
  children: React.ReactNode;
}

export const Tab = ({ label, children }: TabProps) => <>{children}</>;

interface TabsProps {
  children: ReactElement<TabProps>[] | ReactElement<TabProps>;
  tabListStyle?: object;
  defaultIndex?: number;
}

export const Tabs = ({ children, tabListStyle, defaultIndex = 0 }: TabsProps) => {
  // Convert children to an array to handle both single and multiple children scenarios
  const childrenArray = React.Children.toArray(children) as ReactElement<TabProps>[];

  // Validate the defaultIndex is within the range of the children array
  const validatedDefaultIndex = defaultIndex >= 0 && defaultIndex < childrenArray.length
    ? defaultIndex
    : 0;

  const initialActiveTab = childrenArray[validatedDefaultIndex].props.label;
  const [activeTab, setActiveTab] = React.useState<string>(initialActiveTab);

  const handleTabClick = (label: string) => setActiveTab(label);

  return (
    <Box>
      <UnorderedList className="de_nav" ms={0} {...tabListStyle}>
        {childrenArray.map((child, index) => {
          const label = child.props.label;
          return (
            <ListItem
              key={index} // Changed to index to ensure uniqueness
              className={`tab ${activeTab === label ? 'active' : ''} my-1`}
              onClick={() => handleTabClick(label)}
            >
              <span>{label}</span>
            </ListItem>
          );
        })}
      </UnorderedList>
      <Box mt={2}>
        {childrenArray.map((child) => {
          if (child.props.label !== activeTab) return null;
          return child.props.children;
        })}
      </Box>
    </Box>
  );
};
