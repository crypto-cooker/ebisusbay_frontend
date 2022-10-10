import { useWindowSize } from "@src/hooks/useWindowSize";
import useBreakpoint from "use-breakpoint";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { listingFilterOptions } from "@src/Components/components/constants/filter-options";
import { CollectionSortOption } from "@src/Components/Models/collection-sort-option.model";
import Button from "@src/Components/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faFilter, faSort, faFlag } from "@fortawesome/free-solid-svg-icons";
import { SortDropdown } from "@src/Components/Collection/CollectionTaskBar/SortDropdown";
import { SearchBar } from "@src/Components/Collection/CollectionTaskBar/SearchBar";
import MakeCollectionOfferDialog from "@src/Components/Offer/Dialogs/MakeCollectionOfferDialog";
import { useDispatch, useSelector } from "react-redux";
import MetaMaskOnboarding from "@metamask/onboarding";
import { chainConnect, connectAccount } from "@src/GlobalState/User";
import SweepFloorDialog from "@src/Components/Collection/CollectionTaskBar/SweepFloorDialog";
import { toast } from 'react-toastify';
import { Modal } from '@src/Components/components/chakra-components'

import {
  useDisclosure,
  Select
} from '@chakra-ui/react'

import useReportCollection from '@src/hooks/useReportCollection'


const BREAKPOINTS = { xs: 0, m: 768, l: 1199, xl: 1200 };
const REASONSLIST = ['Fake collection or possible scam', 'Explicit or sensitive content', 'Spam', 'Other']

export const CollectionTaskBar = ({ collection, onFilterToggle, onSortToggle }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentFilter = useSelector((state) => state.collection.query.filter);

  const [useMobileMenu, setUseMobileMenu] = useState(false);
  const [collectionOfferOpen, setCollectionOfferOpen] = useState(false);
  const [sweepFloorOpen, setSweepFloorOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [createNewReport, response] = useReportCollection();

  const [selectedReason, setSelectedReason] = useState('');

  const windowSize = useWindowSize();
  const { breakpoint, maxWidth, minWidth } = useBreakpoint(BREAKPOINTS);

  useEffect(() => {
    setUseMobileMenu(minWidth < BREAKPOINTS.m);
  }, [breakpoint]);

  const openCollectionOfferDialog = () => {
    if (user.address) {
      setCollectionOfferOpen(true);
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  const activeFiltersCount = () => {
    const traits = Object.values(currentFilter.traits)
      .map((traitCategoryValue) => traitCategoryValue.length)
      .reduce((prev, curr) => prev + curr, 0);
    const powertraits = Object.values(currentFilter.powertraits)
      .map((traitCategoryValue) => traitCategoryValue.length)
      .reduce((prev, curr) => prev + curr, 0);
    let count = traits + powertraits;

    if (currentFilter.minPrice) count++;
    if (currentFilter.maxPrice) count++;
    if (currentFilter.minRank) count++;
    if (currentFilter.maxRank) count++;
    if (currentFilter.search) count++;
    if (currentFilter.listed) count++;

    return count;
  };

  const openSweepFloorDialog = () => {
    if (user.address) {
      setSweepFloorOpen(true);
    } else {
      if (user.needsOnboard) {
        const onboarding = new MetaMaskOnboarding();
        onboarding.startOnboarding();
      } else if (!user.address) {
        dispatch(connectAccount());
      } else if (!user.correctChain) {
        dispatch(chainConnect());
      }
    }
  };

  const sendCollectionReport = async () => {

    if (!user?.address) {
      toast.error('You need to connect a wallet');
      return;
    }

    const res = await createNewReport(user.address, { collectionAddress: collection.address, reason: selectedReason })
    if (res){
        onClose();
        toast.success('Generated report');
      }
    else {
      toast.error('Error');
    }
  }

  const ModalBody = () => {

    return (
      <>
        I think this collection is:
        <Select className='mt-2' placeholder='Select option' onChange={(e) => { setSelectedReason(e.target.value) }}>
          {REASONSLIST.map((reason) => (
            <option value={reason}>{reason}</option>
          ))}
        </Select>
      </>
    )
  }

  const ModalFooter = () => {

    return (
      <div className="w-100">
        <div className="d-flex justify-content-center">
          <Button type="legacy-outlined" className="me-2" onClick={onClose}>
            Cancel
          </Button>
          <Button type="legacy" onClick={sendCollectionReport} disabled={!selectedReason}>
            Report
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {useMobileMenu ? (
        <>
          <div className="d-flex mb-2">
            <SearchBar />
          </div>
          <div className="d-flex mb-2">
            <div className="col">
              <Button type="legacy-outlined" className="w-100" style={{ height: '100%' }} onClick={onFilterToggle}>
                <FontAwesomeIcon icon={faFilter} />

                <span className="ms-2">Filter {activeFiltersCount() > 0 ? `(${activeFiltersCount()})` : ''}</span>
              </Button>
            </div>
            <div className="col ms-2">
              <Button type="legacy-outlined" className="w-100" style={{ height: '100%' }} onClick={onSortToggle}>
                <FontAwesomeIcon icon={faSort} />
                <span className="ms-2">Sort</span>
              </Button>
            </div>
          </div>

          <div className="d-flex mb-2">
            <div className="flex-fill">
              <Button
                type="legacy"
                className="w-100"
                onClick={() => setCollectionOfferOpen(true)}
              >
                Make collection offer
              </Button>
            </div>
            <div className="flex-fill ms-2">
              <Button
                type="legacy"
                className="w-100 h-100"
                onClick={openSweepFloorDialog}
              >
                <FontAwesomeIcon icon={faBroom} />
                <span className="ms-2">Sweep</span>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="d-flex mb-2">
          <div className="">
            <Button type="legacy-outlined" style={{ height: '100%' }} onClick={onFilterToggle}>
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
            <Button
              type="legacy"
              onClick={openCollectionOfferDialog}
            >
              Make collection offer
            </Button>
          </div>
          <div className="ms-2 my-auto">
            <Button
              type="legacy"
              onClick={openSweepFloorDialog}
            >
              <FontAwesomeIcon icon={faBroom} />
              <span className="ms-2">Sweep Floor</span>
            </Button>
          </div>
          <div className="ms-2 my-auto">
            <Button
              type="legacy"
              onClick={() => {
                onOpen();
                setSelectedReason('');
              }}
            >
              <FontAwesomeIcon icon={faFlag} />
              <span className="ms-2">Report</span>
            </Button>
          </div>
        </div>
      )}

      {collectionOfferOpen && (
        <MakeCollectionOfferDialog
          isOpen={collectionOfferOpen}
          onClose={() => setCollectionOfferOpen(false)}
          collection={collection}
        />
      )}

      {sweepFloorOpen && (
        <SweepFloorDialog
          isOpen={sweepFloorOpen}
          onClose={() => setSweepFloorOpen(false)}
          collection={collection}
          activeFilters={currentFilter}
          fullscreen={useMobileMenu}
        />
      )}

      <Modal isCentered title={'Report this collection'} body={ModalBody()} dialogActions={ModalFooter()} isOpen={isOpen} onClose={onClose} />

    </>
  )
}