import { useState } from 'react';
import Button from '../../../../components/Button';
import Input from '../Input';

export default function Form() {
  const [isOnSave, setIsOnSave] = useState(false);
  const handleSaveProfile = () => {
    setIsOnSave(true);
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <div>
        <Input label="User Name" placeholder="Enter Username" />
      </div>
      <div>
        <Input label="Custom URL" placeholder="Enter your custom URL" />
      </div>
      <div>
        <Input label="Email Address" placeholder="Enter Email" />
      </div>
      <div>
        <Input label="Twitter Handle" placeholder="Enter Twitter Handle" />
      </div>
      <div>
        <Input label="Instagram Handle" placeholder="Enter Instagram Handle" />
      </div>
      <div>
        <Input label="Discord ID" placeholder="Enter Discord ID" />
      </div>
      <div>
        <Input label="Website" placeholder="Enter Website URL" />
      </div>
      <div className="d-flex justify-content-end mt-5">
        <Button type="legacy" onClick={handleSaveProfile} isLoading={isOnSave}>
          Save Profile
        </Button>
      </div>
    </div>
  );
}
