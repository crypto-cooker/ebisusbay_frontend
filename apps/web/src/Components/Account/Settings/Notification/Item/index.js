import {Switch} from "@chakra-ui/react";

export default function NotificationItem({ title, description, isChecked, onChange }) {
  return (
    <div className="d-flex">
      <div className="my-auto me-2">
        <Switch isChecked={isChecked} onChange={(e) => onChange(e.target.checked)}/>
      </div>
      <div>
        <div className="fs-4 fw-bold">{title}</div>
        <div>{description}</div>
      </div>
    </div>
  );
}
