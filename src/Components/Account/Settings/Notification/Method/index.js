import { Form } from 'react-bootstrap';

export default function NotificationMethod({ title, description, isChecked, onChange }) {
  return (
    <div className="row">
      <div className="col-1 my-auto">
        <div>
          <Form.Switch defaultChecked={() => isChecked()} onClick={(e) => onChange(e.target.checked)}/>
        </div>
      </div>
      <div className="col">
        <div>
          <div className="fs-4 fw-bold">{title}</div>
          <div>{description}</div>
        </div>
      </div>
    </div>
  );
}
