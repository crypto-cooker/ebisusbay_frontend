import {useWindowSize} from "@src/hooks/useWindowSize";
import useBreakpoint from "use-breakpoint";
import React, {useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import Select from "react-select";
import {listingFilterOptions} from "@src/Components/components/constants/filter-options";
import {CollectionSortOption} from "@src/Components/Models/collection-sort-option.model";
import Button from "@src/Components/components/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {SortDropdown} from "@src/Components/Collection/CollectionTaskBar/SortDropdown";
import {SearchBar} from "@src/Components/Collection/CollectionTaskBar/SearchBar";


const BREAKPOINTS = { xs: 0, m: 768, l: 1199, xl: 1200 };

export const CollectionTaskBar = ({onFilterToggle}) => {

  const windowSize = useWindowSize();
  const [useMobileMenu, setUseMobileMenu] = useState(false);

  const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS);

  useEffect(() => {
    setUseMobileMenu(minWidth < BREAKPOINTS.m);
  }, [breakpoint]);

  return useMobileMenu ? (
    <>
      <div className="d-flex mb-2">
        <SearchBar />
      </div>
      <div className="d-flex mb-2">
        <div className="flex-fill">
          <Button type="legacy-outlined" className="w-100" style={{height: '100%'}} onClick={onFilterToggle}>
            <FontAwesomeIcon icon={faFilter} />
            <span className="ms-2">Filter</span>
          </Button>
        </div>
        <div className="flex-fill ms-2">
          <SortDropdown />
        </div>
      </div>

      <div className="d-flex mb-2">
        <div className="col">

          <Button type="legacy"
                  className="w-100"
            // onClick={withdrawBalance}
            // isLoading={user.withdrawingMarketBalance}
            // disabled={user.withdrawingMarketBalance}
          >
            Make collection offer
          </Button>
        </div>
      </div>
    </>
  ) : (
    <div className="d-flex mb-2">
      <div className="">
        <Button type="legacy-outlined" style={{height: '100%'}} onClick={onFilterToggle}>
          <FontAwesomeIcon icon={faFilter} />
        </Button>
      </div>
      <div className="flex-grow-1 ms-2">
        <SearchBar />
      </div>
      <div className="ms-2">
        <SortDropdown />
      </div>
      <div className="ms-2 my-auto">

        <Button type="legacy"
                // onClick={withdrawBalance}
                // isLoading={user.withdrawingMarketBalance}
                // disabled={user.withdrawingMarketBalance}
          >
          Make collection offer
        </Button>
      </div>
    </div>
  )
}