import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { UpdateOwner, EditCollection as EditCollectionTab} from '@src/Components/EditCollection';
import Royalties from "@src/Components/EditCollection/Royalties/Royalties";

const tabs = {
  editCollection: 'editCollection',
  setOwner: 'setOwner',
  royalties: 'royalties'
};

const EditCollection = ({ tab }: { tab: string }) => {

  const router = useRouter();
  const { collection } = router.query;

  const [currentTab, setCurrentTab] = React.useState<string>(tab ?? tabs.editCollection);
  const handleTabChange = useCallback((newTab: string) => {
    setCurrentTab(newTab);
  }, []);

  return (
    <>
      <section className="jumbotron breadcumb no-bg tint">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Edit Collection</h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="gl-legacy container pt-4">
        <div className="row mt-2 mt-sm-4">
          <div className="de_tab">
            <div className='' style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <ul className="de_nav mb-4 text-center text-sm-start">
                  <li className={`tab mb-2 ${currentTab === tabs.editCollection ? 'active' : ''}`}>
                    <span onClick={() => handleTabChange(tabs.editCollection)}>Edit Collection</span>
                  </li>
                  {(
                    <li className={`tab mb-2 ${currentTab === tabs.setOwner ? 'active' : ''}`}>
                      <span onClick={() => handleTabChange(tabs.setOwner)}>Ownership</span>
                    </li>
                  )}
                  <li className={`tab mb-2 ${currentTab === tabs.royalties ? 'active' : ''}`}>
                    <span onClick={() => handleTabChange(tabs.royalties)}>Royalties</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="de_tab_content">
              {currentTab === tabs.editCollection && (
                <EditCollectionTab address={collection} />
              )}
              {currentTab === tabs.setOwner && (
                <UpdateOwner address={collection} />
              )}
              {currentTab === tabs.royalties && (
                <Royalties address={collection} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EditCollection;