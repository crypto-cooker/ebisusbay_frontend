import {Box, FormControl, FormErrorMessage, FormHelperText, Textarea} from "@chakra-ui/react";

interface BioProps {
  value: string;
  handleChange: any;
  error: string;
}

export default function Bio({ value, handleChange, error }:  BioProps) {
  return (
    <Box my={3}>
      <Box fontSize='lg'>Description</Box>
      <Box>
        <FormControl isInvalid={!!error}>
          <Textarea
            as="textarea"
            aria-label="textarea"
            rows={5}
            placeholder="Introduce yourself"
            onChange={handleChange}
            value={value}
            name="collectionInfo.description"
            className="mb-0"
          />
          <FormHelperText className="field-description text-muted">Max 100 characters</FormHelperText>
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>
      </Box>
    </Box>
  );
}
