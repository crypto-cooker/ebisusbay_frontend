import { useRouter } from 'next/router';
import {faUser, faMapPin, faExclamation, faGlobe, faGem} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const tabs = [
  { slug: 'profile', btn: 'Profile', icon: faUser },
  { slug: 'notification', btn: 'Notifications', icon: faExclamation },
  { slug: 'collections', btn: 'Collections', icon: faGem }
  // { slug: 'offer', btn: 'Offers', icon: faMapPin },
  // { slug: 'admin', btn: 'Admin Settings', icon: faUser },
];

export default function TopTabs() {
  const router = useRouter();

  const navigateTo = (link: string) => {
    router.push(`/account/settings/${link}`);
  };

  return (
    <div>
      <div className="de_tab">
        <ul className="de_nav mb-2 text-left mx-0">
          {tabs.map((tab, index) => (
            <li key={index} className={`tab${router?.query?.tab === tab.slug ? ' active' : ''} mb-3`}>
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
