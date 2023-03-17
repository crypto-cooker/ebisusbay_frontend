import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import {caseInsensitiveCompare, debounce} from "@src/utils";
import {ImageKitService} from "@src/helpers/image";
import Blockies from "react-blockies";
import {Heading} from "@chakra-ui/react";

interface CollectionFilterProps {
  collections: any;
  currentFilter: any;
  onFilter: (collections: any) => void;
  keyPrefix?: string | null;
}

export const CollectionFilter = ({collections, currentFilter, onFilter, keyPrefix = null}: CollectionFilterProps) => {
  const [visibleCollections, setVisibleCollections] = useState(collections);

  const viewGetDefaultCheckValue = (address: string) => {
    return currentFilter.includes(address);
  };

  const handleCheck = (event: any, collection: any) => {
    const { id, checked } = event.target;

    if (!collection) return;
    let tmpSelectedCollections = currentFilter;
    if (checked && !currentFilter.includes(collection.address)) {
      tmpSelectedCollections.push(collection.address);
    } else if (!checked) {
      tmpSelectedCollections = currentFilter.filter((c: any) => !caseInsensitiveCompare(c, collection.address));
    }
    onFilter(tmpSelectedCollections);
  };

  const getKey = (collection: any) => {
    let key = collection.address;
    if (collection.id) {
      key += `-${collection.id}`
    }
    if (keyPrefix) {
      key = `${keyPrefix}-${key}`
    }
    return key;
  };

  const onTextFilterChange = debounce((event: any) => {
    const { value } = event.target;
    const list = value ? collections.filter((c: any) => c.name.toLowerCase().includes(value.toLowerCase())) : collections;
    setVisibleCollections(list);
  }, 300);

  useEffect(() => {
    setVisibleCollections(collections);
  }, [collections]);

  return (
    <div className="filter-pane">
      <Heading as="h5" size="md" className="mb-2">Collections</Heading>
      <Form.Control type="text" placeholder="Filter" onChange={onTextFilterChange}/>
      {visibleCollections.map((collection: any) => (
        <div key={getKey(collection)}>
          <Form.Check
            type="checkbox"
            id={getKey(collection)}
            className="collection-checkbox my-2"
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
                    <img
                      src={ImageKitService.buildAvatarUrl(collection.metadata.avatare)}
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