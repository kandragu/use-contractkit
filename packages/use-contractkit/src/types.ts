import { CeloTokenContract } from '@celo/contractkit/lib/base';
import { MiniContractKit } from '@celo/contractkit/lib/mini-kit';
import React from 'react';

import { Priorities, WalletTypes } from './constants';

export type Maybe<T> = T | null | undefined;

/**
 * ID of a Celo chain.
 */
export enum ChainId {
  Alfajores = 44787,
  Baklava = 62320,
  Mainnet = 42220,
}
/**
 * Network connection information.
 */
export interface Network {
  name: string;
  rpcUrl: string;
  graphQl?: string;
  explorer: string;
  chainId: ChainId | number;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface CeloNetwork extends Network {
  chainId: ChainId;
}

/**
 * Information about a provider to use for the dApp.
 */
export interface Provider {
  name: string;
  type: WalletTypes;
  description: string | JSX.Element;
  icon: string | React.FC<React.SVGProps<SVGSVGElement>>;
  canConnect: () => boolean;
  showInList: () => boolean;
  listPriority: () => Priorities;
  installURL?: string;
}

export interface WalletConnectProvider extends Provider {
  walletConnectId?: string;
  getDeepLink?: (uri: string) => string;
  getDesktopLink?: (uri: string) => string;
}

/**
 * Connects to the blockchain.
 */
export interface Connector {
  kit: MiniContractKit;
  type: WalletTypes;
  account: Maybe<string>;
  feeCurrency: CeloTokenContract;
  initialised: boolean;
  initialise: () => Promise<this> | this;
  close: () => Promise<void> | void;
  updateFeeCurrency?: (token: CeloTokenContract) => Promise<void>;
  supportsFeeCurrency: () => boolean;
  getDeeplinkUrl?: (uri: string) => string;
  updateKitWithNetwork?: (network: Network) => Promise<void>;
  onNetworkChange?: (callback: (chainId: number) => void) => void;
  onAddressChange?: (callback: (address: Maybe<string>) => void) => void;
  persist: () => void;
}

/**
 * Dapp information.
 */
export interface Dapp {
  name: string;
  description: string;
  url: string;
  icon: string;
}

export interface WalletEntryLogos {
  sm: string;
  md: string;
  lg: string;
}
export interface WalletEntry {
  id: string;
  name: string;
  description: string;
  homepage: string;
  chains: string[];
  versions: string[];
  logos: WalletEntryLogos;
  app: {
    browser: string;
    ios: string;
    android: string;
    mac: string;
    windows: string;
    linux: string;
  };
  mobile: {
    native: string;
    universal: string;
  };
  desktop: {
    native: string;
    universal: string;
  };
  metadata: {
    shortName: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  responsive?: {
    mobileFriendly: boolean;
    browserFriendly: boolean;
    mobileOnly: boolean;
    browserOnly: boolean;
  };
}

export type AppRegistry = Record<string, WalletEntry>;
