import React from 'react';
import styled from 'styled-components';

const TableHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor2};
  margin: 8px 0px;
  padding: 8px 0px;
  font-size: 14px;

  .table-row-item {
    width: 12%;

    &:first-child {
      display: flex;
      align-items: center;
      width: 13%;
    }

    &:nth-child(7) {
      width: 10%;
    }
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    .table-row-item {
      &:first-child {
        width: 10%;
      }
    }
    .nft-title {
      display: none;
    }
  }

  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
export default function TableHeader({ type }) {
  return type === 'made' ? (
    <TableHeaderContainer>
      <div className="table-row-item">Offer</div>
      <div className="table-row-item">Price</div>
      <div className="table-row-item">Made</div>
      <div className="table-row-item"></div>
      <div className="table-row-item"></div>
    </TableHeaderContainer>
  ) : (
    <TableHeaderContainer>
      <div className="table-row-item">Offer</div>
      <div className="table-row-item">Price</div>
      <div className="table-row-item">Made</div>
      <div className="table-row-item"></div>
      <div className="table-row-item"></div>
    </TableHeaderContainer>
  );
}
