import Input from '../Input';

export default function Form() {
  return (
    <div>
      <div>
        <Input label="User Name" />
      </div>
      <div>
        <Input label="Custom URL" />
      </div>
      <div>
        <Input label="Email Address" />
      </div>
      <div>
        <Input label="Discord ID" />
      </div>
      <div>
        <Input label="Twitter Handle" />
      </div>
      <div>
        <Input label="Website" />
      </div>
    </div>
  );
}
