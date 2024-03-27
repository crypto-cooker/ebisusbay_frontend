import {Box, Container, FormControl, FormLabel, Heading, Select, Text, VStack} from "@chakra-ui/react";
import React, {ChangeEvent} from "react";
import {Card} from "@src/components-v2/foundation/card";
import useBarterDeal from "@src/components-v2/feature/deal/use-barter-deal";

interface Step3ReviewDetailsProps {
  address: string;
  onConfirm: () => void;
}

export const Step3ReviewDetails = ({address, onConfirm}: Step3ReviewDetailsProps) => {
  const { setDuration } = useBarterDeal();

  const handleExpirationDateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDuration(parseInt(e.target.value));
  }

  return (
    <>
      <Box my={4}>
        <Heading>
          Step 3: Review details
        </Heading>
        <Text>
          Set how long this deal should be active, then review selections and click the Confirm button at the bottom to create the deal request.
        </Text>
      </Box>

      <Container>
        <Card>
          <VStack align='start'>
            <Box>
              <FormControl>
                <FormLabel>Duration</FormLabel>
                <Select
                  defaultValue={604800000}
                  onChange={handleExpirationDateChange}
                  maxW='200px'
                >
                  {expirationDatesValues.map((time) => (
                    <option value={time.value}>{time.label}</option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </VStack>
        </Card>
      </Container>
    </>
  )
}

const expirationDatesValues = [
  {
    value: 3600000,
    label: '1 hour'
  },
  {
    value: 10800000,
    label: '3 hours'
  },
  {
    value: 21600000,
    label: '6 hours'
  },
  {
    value: 86400000,
    label: '1 day'
  },
  {
    value: 259200000,
    label: '3 days'
  },
  {
    value: 604800000,
    label: '1 week'
  },
  {
    value: 1296000000,
    label: '2 weeks'
  },
  {
    value: 2592000000,
    label: '1 month'
  },
  {
    value: 7776000000,
    label: '3 month'
  },
  {
    value: 15552000000,
    label: '6 months'
  },
]