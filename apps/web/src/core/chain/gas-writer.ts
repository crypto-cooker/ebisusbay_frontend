import {Contract} from "ethers";
import {parseUnits} from "ethers/lib/utils";

export class GasWriter {
  public contract: Contract;

  constructor(contract: Contract) {
    this.contract = contract;
  }

  static withContract(contract: Contract) {
    return new GasWriter(contract);
  }

  public async call(method: string, ...args: any[]) {
    const gasPrice = parseUnits('12000', 'gwei');
    const gasEstimate = await this.contract.estimateGas[method](...args);
    const gasLimit = gasEstimate.mul(2);
    let extra = {
      gasPrice,
      gasLimit
    };

    return this.contract[method](...args, extra);
  }
}