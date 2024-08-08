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
  onChange?: (index: number) => void;
}

export const Tabs = ({ children, tabListStyle, defaultIndex = 0, onChange }: TabsProps) => {
  // Convert children to an array to handle both single and multiple children scenarios
  const childrenArray = React.Children.toArray(children) as ReactElement<TabProps>[];

  // Validate the defaultIndex is within the range of the children array
  const validatedDefaultIndex = defaultIndex >= 0 && defaultIndex < childrenArray.length
    ? defaultIndex
    : 0;

  const [activeIndex, setActiveIndex] = React.useState<number>(validatedDefaultIndex);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    onChange?.(index);
  }

  return (
    <Box>
      <UnorderedList className="de_nav" ms={0} {...tabListStyle}>
        {childrenArray.map((child, index) => {
          const label = child.props.label;
          return (
            <ListItem
              key={index} // Changed to index to ensure uniqueness
              className={`tab ${activeIndex === index ? 'active' : ''} my-1`}
              onClick={() => handleTabClick(index)}
            >
              <span>{label}</span>
            </ListItem>
          );
        })}
      </UnorderedList>
      <Box mt={2}>
        {childrenArray.map((child, index) => {
          if (index !== activeIndex) return null;
          return child.props.children;
        })}
      </Box>
    </Box>
  );
};
