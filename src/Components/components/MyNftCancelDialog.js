import React, { memo, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { MyNftCancelDialogActions } from '../../GlobalState/User';
import useCancelGaslessListing from '@src/Components/Account/Settings/hooks/useCancelGaslessListing';
import { MyNftPageActions } from "@src/GlobalState/User";
import { toast } from 'react-toastify';
import {isGaslessListing} from "@src/utils";

const mapStateToProps = (state) => ({
  walletAddress: state.user.address,
  myNftPageListDialog: state.user.myNftPageListDialog,
  myNftPageCancelDialog: state.user.myNftPageCancelDialog,
});

const MyNftCancelDialog = ({ myNftPageCancelDialog }) => {
  const dispatch = useDispatch();

  const [cancelGaslessListing, response] = useCancelGaslessListing();

  const cancelGaslessListingFun = async () => {
    try {
      const res = await cancelGaslessListing(myNftPageCancelDialog.listingId)
      dispatch(MyNftPageActions.hideNftPageCancelDialog());
      toast.success('Canceled successfully')
    }
    catch(error){
      console.log(error)
      toast.error('Error')
    }
  }

  useEffect(() => {
    if (myNftPageCancelDialog) {
      if(!isGaslessListing(myNftPageCancelDialog.listingId)){
        dispatch(
          MyNftCancelDialogActions.cancelListing({
            address: myNftPageCancelDialog.contract.address,
            id: myNftPageCancelDialog.id,
            listingId: myNftPageCancelDialog.listingId,
          })
        );
      }
      else{
        cancelGaslessListingFun()
      }
    }

    // eslint-disable-next-line
  }, [myNftPageCancelDialog, isGaslessListing]);

  return <></>;
};

export default connect(mapStateToProps)(memo(MyNftCancelDialog));
