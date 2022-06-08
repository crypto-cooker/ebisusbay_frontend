import { InputGroup, FormControl } from 'react-bootstrap';

export default function Bio() {
  return (
    <div>
      <div className="my-3">Bio</div>
      <div>
        <InputGroup>
          <FormControl as="textarea" aria-label="textarea" rows="5" />
        </InputGroup>
      </div>
    </div>
  );
}
