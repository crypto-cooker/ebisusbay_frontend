import {Button, HStack, Icon, Text, useBreakpointValue} from "@chakra-ui/react";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function TokenRowButton<T>({
  token,
  isActive,
  isAdded,
  setImportToken,
  showImportView,
}: {
  token: T;
  isActive: boolean;
  isAdded: boolean;
  setImportToken: (token: T) => void;
  showImportView: () => void;
}) {
  const isMobile = useBreakpointValue({base: true, sm: false}, {fallback: 'sm'});

  return !isActive && !isAdded ? (
    <Button
      scale={isMobile ? "sm" : "md"}
      width="fit-content"
      onClick={() => {
        if (setImportToken) {
          setImportToken(token);
        }
        showImportView();
      }}
    >
      Import
    </Button>
  ) : (
    <HStack style={{ minWidth: "fit-content" }}>
      <Icon as={FontAwesomeIcon} icon={faCheckCircle} color="success" boxSize={4} />
      <Text color="success">Active</Text>
    </HStack>
  );
}
