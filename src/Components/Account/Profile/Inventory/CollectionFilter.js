import React, {useState} from "react";
import {Accordion, Form} from "react-bootstrap";
import {caseInsensitiveCompare} from "@src/utils";

export const CollectionFilter = ({collections, currentFilter, onFilter, keyPrefix = null}) => {
  const viewGetDefaultCheckValue = (address) => {
    return currentFilter.includes(address);
  };

  const handleCheck = (event, collection) => {
    const { id, checked } = event.target;

    if (!collection) return;
    let tmpSelectedCollections = currentFilter;
    if (checked && !currentFilter.includes(collection.address)) {
      tmpSelectedCollections.push(collection.address);
    } else if (!checked) {
      tmpSelectedCollections = currentFilter.filter((c) => !caseInsensitiveCompare(c, collection.address));
    }
    onFilter(tmpSelectedCollections);
  };

  const getKey = (collection) => {
    let key = collection.address;
    if (collection.id) {
      key += `-${collection.id}`
    }
    if (keyPrefix) {
      key = `${keyPrefix}-${key}`
    }
    return key;
  };

  return (
    <div className="filter-pane">
      <Accordion id="status" defaultActiveKey={'inventory-filters'} flush>
        <Accordion.Item eventKey="inventory-filters">
          <Accordion.Header>
            Collections
          </Accordion.Header>
          <Accordion.Body>
            {collections.map((collection, key) => (
              <div key={getKey(collection)}>
                <Form.Check
                  type="checkbox"
                  id={getKey(collection)}
                  className="collection-checkbox"
                >
                  <Form.Check.Input type={'checkbox'}
                                    value={viewGetDefaultCheckValue(collection.address)}
                                    onChange={(t) => handleCheck(t, collection)}
                                    defaultChecked={viewGetDefaultCheckValue(collection.address)}
                  />
                  <Form.Check.Label className="w-100">
                    <div className="d-flex justify-content-between cursor-pointer w-100">
                      <div>{collection.name}</div>
                      <div className="text-muted">({collection.balance})</div>
                    </div>
                  </Form.Check.Label>
                </Form.Check>
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}