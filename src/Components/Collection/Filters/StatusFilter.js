import {Accordion, Form} from "react-bootstrap";
import React from "react";
import {cleanedQuery, pushQueryString} from "@src/helpers/query";
import {filterListingsByListed, filterListingsByTrait} from "@src/GlobalState/collectionSlice";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";

const statuses = [
  {
    label: 'Buy Now',
    value: 1,
    key: 'status-buynow'
  }
];

export const StatusFilter = ({keyPrefix, ...props}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentFilter = useSelector((state) => state.collection.query.filter);

  const hasActiveStatusFilter = () => {
    return !!currentFilter.listed;
  };

  const viewGetDefaultCheckValue = () => {
    return !!currentFilter.listed;
  };

  const handleCheck = (event, status) => {
    const { id, checked } = event.target;

    currentFilter.listed = checked ? 1 : null;

    pushQueryString(router, {
      slug: router.query.slug,
      ...currentFilter.toPageQuery()
    });

    dispatch(
      filterListingsByListed(currentFilter.listed)
    );
  };

  const getKey = (identifier) => {
    let key = identifier;
    if (keyPrefix) {
      key = `${keyPrefix}-${key}`
    }
    return key;
  };

  return (
    <div {...props}>
      <Accordion id="status" defaultActiveKey={hasActiveStatusFilter() ? 'status' : undefined} flush>
        <Accordion.Item eventKey="status">
          <Accordion.Header>
            Status
          </Accordion.Header>
          <Accordion.Body>
            {statuses.map((status) => (

              <div key={getKey(status.key)}>
                <Form.Check
                  type="checkbox"
                  id={getKey(status.key)}
                  className="status-checkbox"
                >
                  <Form.Check.Input type={'checkbox'}
                                    value={viewGetDefaultCheckValue()}
                                    onChange={(t) => handleCheck(t, status)}
                                    defaultChecked={viewGetDefaultCheckValue()}
                  />
                  <Form.Check.Label className="w-100">
                    <div className="d-flex justify-content-between cursor-pointer w-100">
                      <div>{status.label}</div>
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