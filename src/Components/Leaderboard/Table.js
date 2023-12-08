import React from 'react';
import {round, shortAddress} from '../../utils';
import {utils} from 'ethers';
import styles from './styles.module.scss';
import {useUser} from "@src/components-v2/useUser";

export default function Table({ headers, items }) {
  const {theme: userTheme} = useUser();
  return (
    <table className={`table ${styles.table} table-${userTheme} table-borderless`}>
      <thead className="border-bottom">
        <tr>
          <th scope="col" className="text-center">
            Rank
          </th>
          {headers?.map((header, index) => (
            <th scope="col" key={index} className="text-center">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items?.map((item, index) => (
          <tr key={index}>
            <th scope="row" className="text-center">
              {index + 1}
            </th>
            {Object.keys(item).map((key) => (
              <td key={key} className="text-center">
                {key === 'address' ? <UserName address={item[key]} /> : utils.commify(round(item[key]))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UserName({ address }) {
  // const [name, setName] = useState(shortAddress(address));
  //
  // useEffect(() => {
  //   async function func() {
  //     const cnsName = await getCnsName(address);
  //     if (cnsName) setName(cnsName);
  //   }
  //
  //   func();
  // }, [address]);

  return <>{shortAddress(address)}</>;
}
