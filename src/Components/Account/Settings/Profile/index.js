import Banner from './Banner';
import Bio from './Bio';
import Form from './Form';
import Pfp from './Pfp';

export default function EditProfile() {
  return (
    <div className="row mt-5">
      <div className="col-4">
        <Pfp />
        <Banner />
        <Bio />
      </div>
      <div className="col-8">
        <Form />
      </div>
    </div>
  );
}
