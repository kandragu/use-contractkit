import '@testing-library/jest-dom';

import { CeloContract } from '@celo/contractkit';
import {
  renderHook,
  render,
  act,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import React, { ReactElement } from 'react';

import { Mainnet } from '../src/constants';
import {
  ContractKitProvider,
  ContractKitProviderProps,
} from '../src/contract-kit-provider';
import { Network } from '../src/types';
import { UseContractKit, useContractKit } from '../src/use-contractkit';

interface RenderArgs {
  providerProps: Partial<ContractKitProviderProps>;
}

const defaultProps: ContractKitProviderProps = {
  dapp: {
    name: 'Testing Celo React',
    description: 'Test it well',
    url: 'https://celo.developers',
    icon: '',
  },
  children: null,
};

function renderHookInCKProvider<R>(
  hook: (i: unknown) => R,
  { providerProps }: RenderArgs
) {
  return renderHook<R, unknown>(hook, {
    wrapper: ({ children }) => {
      const props = { ...defaultProps, ...providerProps };
      return <ContractKitProvider {...props}>{children}</ContractKitProvider>;
    },
  });
}

function renderComponentInCKProvider(
  ui: ReactElement<any, string>,
  { providerProps }: RenderArgs
) {
  return render(ui, {
    wrapper: ({ children }) => {
      const props = { ...defaultProps, ...providerProps };
      return <ContractKitProvider {...props}>{children}</ContractKitProvider>;
    },
  });
}

describe('ContractKitProvider', () => {
  describe('user interface', () => {
    const ConnectButton = () => {
      const { connect } = useContractKit();
      return <button onClick={connect}>Connect</button>;
    };

    async function stepsToOpenModal() {
      const dom = renderComponentInCKProvider(<ConnectButton />, {
        providerProps: {},
      });

      const button = await dom.findByText('Connect');
      act(() => {
        fireEvent.click(button);
      });

      return dom;
    }

    describe('when Button with connect is Pressed', () => {
      it('opens wallets modal', async () => {
        const dom = await stepsToOpenModal();

        const modal = await dom.findByText('Connect a wallet');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        expect(modal).toBeVisible();
      });
    });

    describe('when a wallet is selected', () => {
      it.skip('changes to the screen for that wallet', async () => {
        const dom = await stepsToOpenModal();
        const celoWalletButton = await dom.findByText('Celo Wallet');
        await waitFor(
          () => {
            fireEvent.click(celoWalletButton);
          },
          {
            timeout: 5,
          }
        );

        dom.debug();
      });
    });
  });

  describe('hook interface', () => {
    const renderUseCK = (props: Partial<ContractKitProviderProps>) =>
      renderHookInCKProvider<UseContractKit>(useContractKit, {
        providerProps: props,
      });

    describe('regarding networks', () => {
      const networks: Network[] = [
        {
          name: 'SecureFastChain',
          rpcUrl: 'https://rpc-mainnet.matic.network',
          explorer: 'https://explorer.example.com',
          chainId: 9812374,
          nativeCurrency: {
            name: 'SFC',
            symbol: 'SFC',
            decimals: 18,
          },
        },
        {
          name: 'BoringChain',
          rpcUrl: 'https://bsc-dataseed.binance.org/',
          explorer: 'https://explorer.boringchain.org',
          chainId: 0x38,
          nativeCurrency: {
            name: 'BORING',
            symbol: 'BOR',
            decimals: 18,
          },
        },
      ];

      it('defaults to Celo Mainnet', () => {
        const hookReturn = renderUseCK({});
        expect(hookReturn.result.current.network).toEqual(Mainnet);
      });

      it('supports passing other networks', () => {
        const hookReturn = renderUseCK({ networks, network: networks[0] });
        expect(hookReturn.result.current.networks).toEqual(networks);

        expect(hookReturn.result.current.network).toEqual(networks[0]);
      });

      it('updates the Current network', async () => {
        const { result, rerender } = renderUseCK({ networks });

        // FIXME Need to determine behavior when network is not in networks
        expect(result.current.network).toEqual(Mainnet);

        await act(async () => {
          await result.current.updateNetwork(networks[1]);
        });

        rerender();

        expect(result.current.network).toEqual(networks[1]);
      });
    });

    describe('regarding feeCurrency', () => {
      describe('when none given', () => {
        it('defaults to CELO', () => {
          const { result } = renderUseCK({});
          expect(result.current.feeCurrency).toEqual(CeloContract.GoldToken);
        });
        it('does not set on the kit as connector is Unauthenticated', () => {
          const { result } = renderUseCK({});
          expect(result.current.walletType).toEqual('Unauthenticated');
          expect(result.current.kit.connection.defaultFeeCurrency).toEqual(
            undefined
          );
        });
      });

      describe('when feeCurrency WhitelistToken passed', () => {
        it('sets that as the feeCurrency', () => {
          const { result } = renderUseCK({
            feeCurrency: CeloContract.StableTokenBRL,
          });

          expect(result.current.feeCurrency).toEqual(
            CeloContract.StableTokenBRL
          );
        });

        it.todo('sets on the kit');

        it('allows updating feeCurrency', () => {
          const { result } = renderUseCK({});

          expect(result.current.supportsFeeCurrency).toBe(false);
        });
      });
    });
  });
});
