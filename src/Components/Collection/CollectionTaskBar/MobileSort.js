import {Form, Offcanvas} from "react-bootstrap";
import Button from "@src/Components/components/Button";
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTheme} from "@src/Theme/theme";
import {sortOptions} from "@src/Components/components/constants/collection-sort-options";
import {sortListings} from "@src/GlobalState/collectionSlice";

export const MobileSort = ({show, onHide, hasRank}) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.user.theme);
  const currentSort = useSelector((state) => state.collection.query.sort);

  const onSortChange = useCallback(
    (sortOption) => {
      dispatch(sortListings(sortOption));
    },
    // eslint-disable-next-line
    [dispatch]
  );

  return (
    <Offcanvas show={show} placement="bottom" onHide={onHide}>
      <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white': 'dark'}>
        <Offcanvas.Title>Sort By</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="pb-5 overflow-hidden">
          {sortOptions.filter((o) => hasRank || o.key !== 'rank').map((option, key) => (
            <div key={key} className="my-2">
              <Form.Check
                type="radio"
                id={`${option.key}-${option.direction}`}
              >
                <Form.Check.Input type={'radio'}
                                  value={`${option.key}-${option.direction}`}
                                  onChange={() => onSortChange(option)}
                                  checked={currentSort.key === option.key && currentSort.direction === option.direction}
                />
                <Form.Check.Label className="w-100">
                  <div className="d-flex justify-content-between cursor-pointer w-100">
                    <div>{option.label}</div>
                  </div>
                </Form.Check.Label>
              </Form.Check>
            </div>
          ))}
        </div>
        <div className="d-flex fixed-bottom px-2 py-2" style={{backgroundColor: getTheme(theme).colors.bgColor1}}>
          <div className="flex-fill">
            <Button type="legacy" className="w-100" style={{height: '100%'}} onClick={onHide}>
              <span>Done</span>
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}