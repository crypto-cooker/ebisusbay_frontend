import { useState } from 'react';
import Button from '../../../components/Button';
import OfferRow from './Row';

const OfferItems = [
  { title: 'collection name', floor: '100' },
  { title: 'collection name', floor: '100' },
];

export default function Offer() {
  const [isOnSave, setIsOnSave] = useState(false);
  const handleSaveProfile = () => {
    setIsOnSave(true);
  };

  return (
    <div className="row mt-5">
      <h2>Offer Settings</h2>
      <p>Set a minimum offer amount for your collections so low offers are automatically ignored.</p>
      <div className="row">
        {OfferItems.map((item) => (
          <div className="col-12" key={item.title}>
            <OfferRow title={item.title} floor={item.floor} />
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
