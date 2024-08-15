import {Container, ContainerProps} from "@chakra-ui/react";

export const DefaultContainer = ({children, ...props}: ContainerProps) => {
  return (
    <Container maxW='2560px' px={{base: 2, sm: 8}} {...props}>
      {children}
    </Container>
  )
}

export const StandardContainer = ({children, ...props}: ContainerProps) => {
  return (
    <Container maxW='container.lg' {...props}>
      {children}
    </Container>
  )
}