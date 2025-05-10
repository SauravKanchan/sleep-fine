// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import { IStaking } from "./IStaking.sol";

contract MockStaking is IStaking {
    uint32 private _era = 100;

    struct UserState {
        Stake stake;
        Roles role;
        address payee;
        address[] nominations;
        uint32 commission;
        Unbonding[] unbondingQueue;
    }

    mapping(address => UserState) private users;

    function bond() external payable override returns (uint128 amount) {
        users[msg.sender].stake.active += uint128(msg.value);
        users[msg.sender].stake.total += uint128(msg.value);
        return uint128(msg.value);
    }

    function unbond(uint128 value) external override returns (uint128 amount) {
        Stake storage s = users[msg.sender].stake;
        if (value > s.active) value = s.active;
        s.active -= value;
        users[msg.sender].unbondingQueue.push(Unbonding({ era: _era + 2, amount: value }));
        return value;
    }

    function full_unbond() external override returns (uint128 amount) {
        Stake storage s = users[msg.sender].stake;
        amount = s.active;
        s.active = 0;
        users[msg.sender].unbondingQueue.push(Unbonding({ era: _era + 2, amount: amount }));
        return amount;
    }

    function rebond_unbonded(uint128 value) external override returns (uint128 amount) {
        users[msg.sender].stake.active += value;
        return value;
    }

    function withdraw_unbonded() external override returns (uint128 amount) {
        Unbonding[] storage queue = users[msg.sender].unbondingQueue;
        uint128 withdrawable = 0;
        uint newLength = 0;

        for (uint i = 0; i < queue.length; i++) {
            if (queue[i].era <= _era) {
                withdrawable += queue[i].amount;
            } else {
                queue[newLength++] = queue[i];
            }
        }

        // Resize the queue
        while (queue.length > newLength) {
            queue.pop();
        }

        users[msg.sender].stake.total -= withdrawable;
        return withdrawable;
    }

    function set_payee(address payee_) external override returns (bool) {
        users[msg.sender].payee = payee_;
        return users[msg.sender].stake.active > 0;
    }

    function minimum_bond() external pure override returns (uint128) {
        return 1 ether;
    }

    function stake_of() external view override returns (Stake memory) {
        return users[msg.sender].stake;
    }

    function stake_able() external pure override returns (uint128) {
        return 1_000_000 ether;
    }

    function payee() external view override returns (address) {
        return users[msg.sender].payee;
    }

    function era() external view override returns (uint32) {
        return _era;
    }

    function unbonding_queue() external view override returns (Unbonding[] memory) {
        return users[msg.sender].unbondingQueue;
    }

    function nominate(address[] calldata targets) external override returns (bool) {
        users[msg.sender].role = Roles.NOMINATOR;
        users[msg.sender].nominations = targets;
        return users[msg.sender].stake.active > 0;
    }

    function validate(uint32 _commission) external override returns (bool) {
        users[msg.sender].role = Roles.VALIDATOR;
        users[msg.sender].commission = _commission;
        return users[msg.sender].stake.active > 0;
    }

    function chill() external override returns (bool) {
        users[msg.sender].role = Roles.CHILLED;
        delete users[msg.sender].nominations;
        users[msg.sender].commission = 0;
        return users[msg.sender].stake.active > 0;
    }

    function max_nominations() external pure override returns (uint32) {
        return 16;
    }

    function role() external view override returns (Roles) {
        return users[msg.sender].role;
    }

    function nominations() external view override returns (address[] memory) {
        return users[msg.sender].nominations;
    }

    function commission() external view override returns (uint32) {
        return users[msg.sender].commission;
    }

    function minimum_validator_bond() external pure override returns (uint128) {
        return 100 ether;
    }

    function minimum_nominator_bond() external pure override returns (uint128) {
        return 10 ether;
    }

    function minimum_active_nominator_bond() external pure override returns (uint128) {
        return 25 ether;
    }

    function payout() external pure override returns (uint128) {
        return 5000;
    }

    function pending() external pure override returns (uint128) {
        return 2;
    }

    // Simulate era progression for testing purposes
    function advanceEra() external {
        _era++;
    }
}
