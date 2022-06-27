import { useRouter } from 'next/router';
import { faUser, faMapPin, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const tabs = [
  { id: 'Mainbtn0', slug: 'profile', btn: 'Edit Profile', icon: faUser },
  { id: 'Mainbtn1', slug: 'notification', btn: 'Notification Settings', icon: faExclamation },
  { id: 'Mainbtn2', slug: 'offer', btn: 'Offer Settings', icon: faMapPin },
  { id: 'Mainbtn3', slug: 'admin', btn: 'Admin Settings', icon: faUser },
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
            <li key={tab.id} id={tab.id} className={`tab${router?.query?.tab === tab.slug ? ' active' : ''} mb-3`}>
              <span onClick={() => navigateTo(tab.slug)}>
                <FontAwesomeIcon icon={tab.icon} className="me-3" />
                {tab.btn}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
