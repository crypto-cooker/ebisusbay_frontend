import styled from 'styled-components';
import { Text, Flex } from '@chakra-ui/react';
import { Box, useDisclosure } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Card } from '@src/components-v2/foundation/card';
import { ReactElement, ReactHTMLElement, useEffect, useRef } from 'react';

export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
  display: flex;
  justify-content: start;
  gap: 5px;
  &: hover {
    color: #ffffff;
  }
`;

export const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
`;

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`;

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  &:hover {
    cursor: pointer;
  }
`;

export const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`;

const FilterDrop = styled(Card)`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 5;
  border-radius: 3px;
  width: 180px;
  p:hover {
      opacity: 0.7;
  }
`;

interface FilterOptionsProps {
  isOpen: boolean;
  filterHead: { [value: string]: string };
  filterOptions: string[];
  onClose: () => void;
  setFilter: (value: string | ((prevFilter: string) => string)) => void;
  setFilterOptions: (value: string[] | ((prev: string[]) => string[])) => void;
}

const FilterOptions = ({
  setFilter,
  filterOptions,
  setFilterOptions,
  isOpen,
  onClose,
  filterHead,
}: FilterOptionsProps) => {
  const handleClick = (e: React.MouseEvent, filter: string) => {
    e.stopPropagation();
    setFilter((prevFilter: string) => {
      setFilterOptions((prev: string[]) => {
        prev[prev.indexOf(filter)] = prevFilter;
        return prev;
      });
      return filter;
    });
    onClose();
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
      {isOpen ? (
        <Box ref={ref}>
          <FilterDrop bodyPadding={3}>
            {filterOptions?.map((filter, index) => {
              return (
                <Text
                  key={index}
                  onClick={(e) => {
                    handleClick(e, filter);
                  }}
                >
                  {filterHead[filter]}
                </Text>
              );
            })}
          </FilterDrop>
        </Box>
      ) : null}
    </>
  );
};

interface FilterOptionButton {
  filterOptions: string[];
  setFilter: (value: string | ((prevFilter: string) => string)) => void;
  setFilterOptions: (value: string[] | ((prev: string[]) => string[])) => void;
  filterHead: { [value: string]: string };
}

export const FilterOptionButton = ({ filterOptions, setFilterOptions, setFilter, filterHead }: FilterOptionButton) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Box _hover={{ cursor: 'pointer', color: '#fff' }} position="relative" onClick={onOpen}>
      <FontAwesomeIcon icon={faFilter} />
      <FilterOptions
        isOpen={isOpen}
        onClose={onClose}
        setFilterOptions={setFilterOptions}
        setFilter={setFilter}
        filterOptions={filterOptions}
        filterHead={filterHead}
      />
    </Box>
  );
};
