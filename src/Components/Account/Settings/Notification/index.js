import Button from '../../../components/Button';
import NotificationItem from './Item';

const NotificationItems = [
  { title: 'Item Sold', description: 'Notify you when someone purchased your item.' },
  { title: 'Auction Ended', description: 'Notify you when an Auction you created ends.' },
  { title: 'Bid Activity', description: 'Notify you when someone makes a bid on your item.' },
  { title: 'Successful Purchase', description: 'Notify you when you successfully purchase an item.' },
  { title: 'New Followers', description: 'Notify you when someone follows you.' },
  { title: 'New Likes', description: 'Notify you when someone likes one of your items.' },
  { title: 'Price Change', description: 'Notify you when an item you’ve made an offer on changes its price.' },
  { title: 'Outbid', description: 'Notify you when an offer you placed is surpassed by another bidder.' },
];

export default function Notification() {
  return (
    <div className="row mt-5">
      <div className="row">
        {NotificationItems.map((item) => (
          <div className="col-6" key={item.title}>
            <NotificationItem title={item.title} description={item.description} />
          </div>
        ))}
      </div>
      <div className="col d-flex justify-content-end">
        <Button type="legacy" className="mt-5">
          Update Profile
        </Button>
      </div>
    </div>
  );
}
