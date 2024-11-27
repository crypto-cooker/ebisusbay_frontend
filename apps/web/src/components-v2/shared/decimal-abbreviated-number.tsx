import {Box, Text} from "@chakra-ui/react";
import {subscriptedDecimal} from "@market/helpers/utils";

interface DecimalAbbreviatedNumberProps {
  value: number | string;
  leftText?: string;
}

const DecimalAbbreviatedNumber = ({ value, leftText }: DecimalAbbreviatedNumberProps) => {
  const valueObj = subscriptedDecimal(value);

  return (
    <Box>
      {typeof valueObj === 'string' ? (
        <>{leftText}{valueObj}</>
      ) : (
        <Box>
          {leftText}
          {valueObj.left}
          {!!valueObj.subscript && (
            <Box as='span' fontSize='xs' verticalAlign='sub'>
              {valueObj.subscript}
            </Box>
          )}
          {valueObj.right}
        </Box>
      )}
    </Box>
  )
}

export default DecimalAbbreviatedNumber;