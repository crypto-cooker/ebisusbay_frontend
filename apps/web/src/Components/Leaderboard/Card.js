import React from 'react';
import styles from './styles.module.scss';
import {Heading} from "@chakra-ui/react";

export default function Card({ title, totalVolume, name, onClick, active }) {
  return (
    <div className={`${styles.card} ${active ? `${styles.active}` : ''}`} onClick={onClick}>
      <Heading as="h3" size="md" className="mb-0">{title}</Heading>
      <Heading as="h3" size="md">{totalVolume} CRO</Heading>
      <div className="d-flex justify-content-between">
        <Heading as="h3" size="md" className="mb-0 mt-4">#1 {name}</Heading>
      </div>
    </div>
  );
}
