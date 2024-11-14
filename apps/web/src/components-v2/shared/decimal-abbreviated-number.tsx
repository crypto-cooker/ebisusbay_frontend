import {Box, Text} from "@chakra-ui/react";
import {subscriptedDecimal} from "@market/helpers/utils";

interface DecimalAbbreviatedNumberProps {
  value: number | string;
}

const DecimalAbbreviatedNumber = ({ value }: DecimalAbbreviatedNumberProps) => {
  const valueObj = subscriptedDecimal(value);

  return (
    <Box>
      {typeof valueObj === 'string' ? (
        <>{valueObj}</>
      ) : (
        <Box>
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