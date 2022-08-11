import { Form } from 'react-bootstrap';

export default function Input({ label, placeholder }) {
  return (
    <div>
      <Form.Label htmlFor="ebi-input">{label}</Form.Label>
      <Form.Control type="text" id="ebi-input" aria-describedby="ebi-input" placeholder={placeholder} />
    </div>
  );
}
