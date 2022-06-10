import { useRouter } from 'next/router';

const tabs = [
  { id: 'Mainbtn0', slug: 'profile', btn: 'Edit Profile' },
  { id: 'Mainbtn1', slug: 'notification', btn: 'Notification Settings' },
  { id: 'Mainbtn2', slug: 'offer', btn: 'Offer Settings' },
  { id: 'Mainbtn3', slug: 'admin', btn: 'Admin Settings' },
];

export default function TopTabs() {
  const router = useRouter();

  const navigateTo = (link) => {
    router.push(`/account/${link}`);
  };

  return (
    <div>
      <div className="de_tab">
        <ul className="de_nav mb-2 text-left mx-0">
          {tabs.map((tab) => (
            <li key={tab.id} id={tab.id} className={`tab${router?.query?.tab === tab.slug ? ' active' : ''}`}>
              <span onClick={() => navigateTo(tab.slug)}>{tab.btn}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
