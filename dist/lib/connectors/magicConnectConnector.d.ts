import type { InstanceWithExtensions, MagicSDKAdditionalConfiguration, MagicSDKExtensionsOption, SDKBase } from '@magic-sdk/provider';
import type { EthNetworkConfiguration } from '@magic-sdk/types';
import type { Chain } from '@wagmi/core';
import { MagicConnector } from './magicConnector.js';
export interface MagicConnectorOptions {
    apiKey: string;
    magicSdkConfiguration?: MagicSDKAdditionalConfiguration;
    networks?: EthNetworkConfiguration[];
}
/**
 * Magic Connect Connector class used to connect to wallet using Magic Connect modal
 * This uses the modal UI from Magic itself and styles for it can be configured using
 * magic dashboard.
 *
 * @example
 * ```typescript
 * import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector';
 * const connector = new MagicConnectConnector({
 *  options: {
 *     apiKey: YOUR_MAGIC_LINK_API_KEY, //required
 *    //...Other options
 *  },
 * });
 * ```
 * @see https://github.com/EveripediaNetwork/wagmi-magic-connector#-usage
 * @see https://magic.link/docs/connect/overview
 */
export declare class MagicConnectConnector extends MagicConnector {
    magic: InstanceWithExtensions<SDKBase, MagicSDKExtensionsOption<string>> | null;
    constructor(config: {
        chains?: Chain[];
        options: MagicConnectorOptions;
    });
    /**
     * Get the Magic Instance
     * @throws {Error} if Magic API Key is not provided
     */
    getMagicSDK(): InstanceWithExtensions<SDKBase, MagicSDKExtensionsOption<string>> | null;
    /**
     * Connect method attempts to connects to wallet using Magic Connect modal
     * this will open a modal for the user to select their wallet
     */
    connect(): Promise<{
        account: `0x${string}`;
        email: import("magic-sdk").UserInfo | undefined;
        chain: {
            id: number;
            unsupported: boolean;
        };
        provider: any;
    }>;
    /**
     * Provider events to run methods on various events
     * on user session
     */
    private registerProviderEventListeners;
    /**
     * checks if user is authorized with Magic Connect
     */
    isAuthorized(): Promise<boolean>;
    /**
     * method that switches chains given a chainId.
     * This only works when user provides multiple networks in options
     * @param chainId
     * @throws {Error} if chainId is not supported
     */
    switchChain(chainId: number): Promise<Chain>;
}
