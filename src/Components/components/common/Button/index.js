import React from 'react';
import styled from 'styled-components';
import {Spinner} from "@chakra-ui/react";

const LegacyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  color: #fff !important;
  background: #218cff;
  border-radius: 6px;
  letter-spacing: normal;
  outline: 1px solid #218cff;
  font-weight: 800;
  text-decoration: none;
  padding: 8px 24px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 20px 0px rgb(131 100 226 / 0%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 2px 2px 20px 0px rgb(131 100 226 / 50%);
    transition: all 0.3s ease;
  }

  &:disabled {
    outline: 1px solid #cccccc;
  }
`;

export const LegacyOutlinedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  color: ${({ theme }) => theme.colors.textColor5} !important;
  background-color: ${({ theme }) => theme.colors.bgColor1} !important;
  border-radius: 6px;
  letter-spacing: normal;
  outline: 1px solid #ddd;
  font-weight: 800;
  text-decoration: none;
  padding: 8px 24px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 2px 2px 20px 0px rgb(131 100 226 / 0%);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 2px 2px 20px 0px rgb(131 100 226 / 50%);
    transition: all 0.3s ease;
  }

  &:focus {
    outline: 1px solid #ddd !important;
  }

  &:disabled {
    cursor: unset;
    background-color: #cccccc !important;
    color: #ffffff !important;
  }
`;

const SpinnerContainer = styled.div`
  margin-right: 6px;
`;

export default function Button({ styleType = 'default', isLoading = false, children, ...props }) {
  if (styleType === 'default-outlined') {
    return (
      <LegacyOutlinedButton className="m-0 text-nowrap p-4 pt-2 pb-2 btn-outline inline white" {...props}>
        {children}
      </LegacyOutlinedButton>
    );
  }

  return (
    <>
      <LegacyButton {...props}>
        {isLoading && (
          <SpinnerContainer>
            <Spinner size='sm' />
          </SpinnerContainer>
        )}
        {children}
      </LegacyButton>
    </>
  );
}
