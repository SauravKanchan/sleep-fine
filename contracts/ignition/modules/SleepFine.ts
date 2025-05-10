// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import MockStakingModule from "./MockStaking";

export default buildModule("SleepFineModule", (m) => {
  const { staking } = m.useModule(MockStakingModule);
  const sleepFine = m.contract("SleepFine", [staking]);

  return { sleepFine };
});
