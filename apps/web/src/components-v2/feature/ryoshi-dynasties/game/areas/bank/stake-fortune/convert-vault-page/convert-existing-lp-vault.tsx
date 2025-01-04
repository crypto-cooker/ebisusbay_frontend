import { FortuneStakingAccount } from '@src/core/services/api-service/graph/types';

interface ImportVaultFormProps {
  vault: FortuneStakingAccount;
  onComplete: () => void;
}

const ConvertExistingLpVault = ({vault, onComplete}: ImportVaultFormProps) => {
  return (
    <>
      ConvertExistingLpVault
    </>
  )
}

export default ConvertExistingLpVault;