import {RdModal} from "@src/components-v2/feature/ryoshi-dynasties/components";
import {useQuery} from "@tanstack/react-query";
import {useAppSelector} from "@src/Store/hooks";
import {ApiService} from "@src/core/services/api-service";
import {getAuthSignerInStorage} from "@src/helpers/storage";
import useCreateSigner from "@src/Components/Account/Settings/hooks/useCreateSigner";

interface DailyCheckinProps {
  isOpen: boolean;
  onClose: () => void;
}
const DailyCheckin = ({isOpen, onClose}: DailyCheckinProps) => {
  const user = useAppSelector(state => state.user);
  const [isLoading, getSigner] = useCreateSigner();

  const fetcher = async () => {
    // let signatureInStorage = getAuthSignerInStorage()?.signature;
    //
    // if (!signatureInStorage) {
    //   const { signature } = await getSigner();
    //   signatureInStorage = signature;
    // }
    // if (signatureInStorage) {
      return await ApiService.withoutKey().ryoshiDynasties.getDailyRewards(user.address!)
    // }

  }
  const {data} = useQuery(
    ['RyoshiDailyCheckin', user.address],
    fetcher,
    {
      enabled: !!user.address
    }
  );

  console.log('data', data);

  return (
    <RdModal
      isOpen={isOpen}
      onClose={onClose}
      title='Claim Daily Reward'
    >
      ok
    </RdModal>
  )
}

export default DailyCheckin;