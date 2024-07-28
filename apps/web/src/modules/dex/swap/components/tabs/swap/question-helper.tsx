import {
  BoxProps,
  Icon,
  IconButton,
  Placement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger
} from "@chakra-ui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStopwatch} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {faQuestionCircle} from "@fortawesome/free-regular-svg-icons";

interface Props extends BoxProps {
  text: string | React.ReactNode;
  placement?: Placement;
  size?: string;
  color?: string;
}

export const QuestionHelper: React.FC<React.PropsWithChildren<Props>> = ({
  text,
  placement = "right-end",
  size = "24px",
  color,
  ...props
}) => {

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Popover placement={placement} {...props}>
      <PopoverTrigger>
        <IconButton onClick={handleClick} aria-label='More Info' icon={<Icon as={FontAwesomeIcon} icon={faQuestionCircle} />} variant='unstyled' h={size} minW={size} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{text}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
