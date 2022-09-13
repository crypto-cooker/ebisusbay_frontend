import React, {useEffect, useState} from "react";
import {Accordion, Form} from "react-bootstrap";
import {caseInsensitiveCompare, debounce} from "@src/utils";
import {hostedImage, ImageKitService} from "@src/helpers/image";
import {CdnImage} from "@src/Components/components/CdnImage";
import Blockies from "react-blockies";
import Image from "next/image";

export const CollectionFilter = ({collections, currentFilter, onFilter, keyPrefix = null}) => {
  const [visibleCollections, setVisibleCollections] = useState(collections);

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

  const onTextFilterChange = debounce((event) => {
    const { value } = event.target;
    const list = value ? collections.filter((c) => c.name.toLowerCase().includes(value.toLowerCase())) : collections;
    setVisibleCollections(list);
  }, 300);

  useEffect(() => {
    setVisibleCollections(collections);
  }, [collections]);

  return (
    <div className="filter-pane">
      <h5>Collections</h5>
      <Form.Control type="text" placeholder="Filter" onChange={onTextFilterChange}/>
      {visibleCollections.map((collection) => (
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
              <div className="d-flex cursor-pointer w-100">
                <div>
                  {collection.metadata?.avatar ? (
                    <Image
                      src={ImageKitService.buildAvatarUrl(collection.metadata.avatar, true)}
                      alt={collection?.name}
                      width="25"
                      height="25"
                      className="rounded-circle my-auto"
                    />
                  ) : (
                    <Blockies seed={collection.address.toLowerCase()} size={5} scale={5} />
                  )}
                </div>
                <div className="my-auto ms-2">{collection.name}</div>
                <div className="text-muted flex-fill text-end my-auto">({collection.balance})</div>
              </div>
            </Form.Check.Label>
          </Form.Check>
        </div>
      ))}
    </div>
  )
}