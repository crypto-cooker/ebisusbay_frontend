import React, { memo, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { MyNftCancelDialogActions } from '../../GlobalState/User';

const mapStateToProps = (state) => ({
  walletAddress: state.user.address,
  myNftPageListDialog: state.user.myNftPageListDialog,
  myNftPageCancelDialog: state.user.myNftPageCancelDialog,
});

const MyNftCancelDialog = ({ myNftPageCancelDialog }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (myNftPageCancelDialog) {
      dispatch(
        MyNftCancelDialogActions.cancelListing({
          address: myNftPageCancelDialog.contract.address,
          id: myNftPageCancelDialog.id,
          listingId: myNftPageCancelDialog.listingId,
        })
      );
    }

    // eslint-disable-next-line
  }, [myNftPageCancelDialog]);

  return <></>;
};

export default connect(mapStateToProps)(memo(MyNftCancelDialog));
