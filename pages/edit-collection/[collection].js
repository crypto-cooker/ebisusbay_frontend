import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { UpdateOwner, EditCollection as EditCollectionTap} from '@src/Components/EditCollection';

const tabs = {
  editCollection: 'editCollection',
  setOwner: 'setOwner',
};

const EditCollection = ({ tab }) => {

  const router = useRouter();
  const { collection } = router.query;

  const [currentTab, setCurrentTab] = React.useState(tab ?? tabs.editCollection);
  const handleTabChange = useCallback((newTab) => {
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
      <section className="container pt-4">
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
                </ul>
              </div>
            </div>
            <div className="de_tab_content">
              {currentTab === tabs.editCollection && (
                <EditCollectionTap address={collection} />
              )}
              {currentTab === tabs.setOwner && (
                <UpdateOwner address={collection} />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EditCollection;