import { ContractKit } from '@celo/contractkit';
import { useContext } from 'react';

import { WalletTypes } from './constants';
import { ContractKitContext } from './contract-kit-provider';
import { Connector, Dapp, Network } from './types';
import { useContractKitMethods } from './use-contract-kit-methods';

/**
 * Exports for ContractKit.
 */
export interface UseContractKit {
  dapp: Dapp;
  kit: ContractKit;
  walletType: WalletTypes;

  /**
   * Name of the account.
   */
  account: string | null;

  address: string | null;
  connect: () => Promise<Connector>;
  destroy: () => Promise<void>;
  network: Network;
  updateNetwork: (network: Network) => void;

  /**
   * Helper function for handling any interaction with a Celo wallet. Perform action will
   * - open the action modal
   * - handle multiple transactions in order
   */
  performActions: (
    ...operations: ((kit: ContractKit) => unknown | Promise<unknown>)[]
  ) => Promise<unknown[]>;

  /**
   * Whether or not the connector has been fully loaded.
   */
  initialised: boolean;
  /**
   * Initialisation error, if applicable.
   */
  initError: Error | null;

  /**
   * Gets the connected instance of ContractKit.
   * If the user is not connected, this opens up the connection modal.
   */
  getConnectedKit: () => Promise<ContractKit>;
}

export const useContractKit = (): UseContractKit => {
  const [{ dapp, connector, connectorInitError, address, network }] =
    useContext(ContractKitContext);
  const { destroy, updateNetwork, connect, getConnectedKit, performActions } =
    useContractKitMethods();

  return {
    address,
    dapp,
    network,
    updateNetwork,
    kit: connector.kit,
    walletType: connector.type,
    account: connector.account,
    initialised: connector.initialised,

    performActions,
    getConnectedKit,
    connect,
    destroy,

    initError: connectorInitError,
  };
};

interface UseContractKitInternal extends UseContractKit {
  connectionCallback: ((connector: Connector | false) => void) | null;
  initConnector: (connector: Connector) => Promise<Connector>;
  pendingActionCount: number;
}

/**
 * useContractKit with internal methods exposed. Package use only.
 */
export const useContractKitInternal = (): UseContractKitInternal => {
  const { initConnector } = useContractKitMethods();
  const [{ pendingActionCount, connectionCallback }] =
    useContext(ContractKitContext);

  return {
    ...useContractKit(),
    connectionCallback,
    initConnector,
    pendingActionCount,
  };
};
