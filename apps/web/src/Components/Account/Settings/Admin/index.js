import { useState } from 'react';
import Button from '../../../components/Button';
import AdminRow from './Row';

const AdminItems = [
  { title: 'collection name', date: '5/20/22', blacklistedBy: 'Bogdan' },
  { title: 'collection name', date: '5/20/22', blacklistedBy: 'Bogdan' },
];

export default function Admin() {
  const [isOnSave, setIsOnSave] = useState(false);
  const handleSaveProfile = () => {
    setIsOnSave(true);
  };

  return (
    <div className="row mt-5">
      <h2>Admin Settings</h2>
      <div className="row">
        <div className="d-flex align-items-center justify-content-between mt-5">
          <h3>Flagged Item</h3>
          <h3>Date</h3>
          <h3>Blacklisted By</h3>
        </div>
      </div>
      <div className="row">
        {AdminItems.map((item) => (
          <div className="col-12" key={item.title}>
            <AdminRow title={item.title} date={item.date} blacklistedBy={item.blacklistedBy} />
          </div>
        ))}
      </div>
      <div className="col d-flex justify-content-end">
        <Button type="legacy" className="mt-5" onClick={handleSaveProfile} isLoading={isOnSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
