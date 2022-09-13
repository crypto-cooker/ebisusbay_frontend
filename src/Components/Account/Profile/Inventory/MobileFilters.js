import {Offcanvas} from "react-bootstrap";
import Button from "@src/Components/components/Button";
import React from "react";
import {useSelector} from "react-redux";
import {CollectionFilter} from "@src/Components/Account/Profile/Inventory/CollectionFilter";
import {getTheme} from "@src/Theme/theme";

export const MobileFilters = ({collections, currentFilter, show, onHide, onFilter}) => {
  const theme = useSelector((state) => state.user.theme);

  const onClearAll = () => {
    for (const item of document.querySelectorAll('.collection-checkbox input[type=checkbox]')) {
      item.checked = false;
    }

    onFilter([]);
  };

  return (
    <Offcanvas show={show} placement="bottom" onHide={onHide} className="filter-pane">
      <Offcanvas.Header closeButton closeVariant={theme === 'dark' ? 'white': 'dark'}>
        <Offcanvas.Title>Filters</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="pb-5 overflow-hidden">
          <CollectionFilter
            collections={collections}
            currentFilter={currentFilter}
            onFilter={onFilter}
            keyPrefix="mobile"
          />
        </div>
        <div className="d-flex fixed-bottom px-2 py-2" style={{backgroundColor: getTheme(theme).colors.bgColor1}}>
          <div className="flex-fill">
            <Button type="legacy-outlined" className="w-100" style={{height: '100%'}} onClick={onClearAll}>
              <span className="ms-2">Clear all</span>
            </Button>
          </div>
          <div className="flex-fill ms-4">
            <Button type="legacy" className="w-100" style={{height: '100%'}} onClick={onHide}>
              <span className="ms-2">Done</span>
            </Button>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}