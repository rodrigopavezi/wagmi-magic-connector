import { Connector } from '@wagmi/core';
import { createWalletClient, custom, getAddress } from 'viem';
import { normalizeChainId } from '../utils.js';
const IS_SERVER = typeof window === 'undefined';
/**
 * Magic Connector class is a base class for Magic Auth and Magic Connect Connectors
 * It implements the common functionality of both the connectors
 *
 * Magic Auth Connector and Magic Connect Connector are the two connectors provided by this library
 * And both of them extend this class.
 */
export class MagicConnector extends Connector {
    ready = !IS_SERVER;
    id = 'magic';
    name = 'Magic';
    isModalOpen = false;
    constructor(config) {
        super(config);
        if (!config.options.apiKey) {
            throw new Error('Magic API Key is required. Get one at https://dashboard.magic.link/');
        }
    }
    async getAccount() {
        const provider = await this.getProvider();
        const accounts = await provider?.request({
            method: 'eth_accounts',
        });
        const account = getAddress(accounts[0]);
        return account;
    }
    async getWalletClient({ chainId } = {}) {
        const provider = await this.getProvider();
        const account = await this.getAccount();
        const chain = this.chains.find((x) => x.id === chainId) || this.chains[0];
        if (!provider)
            throw new Error('provider is required.');
        return createWalletClient({
            account,
            chain,
            transport: custom(provider),
        });
    }
    async getProvider() {
        const magic = this.getMagicSDK();
        return magic?.wallet.getProvider();
    }
    onAccountsChanged(accounts) {
        if (accounts.length === 0 || !accounts[0])
            this.emit('disconnect');
        else
            this.emit('change', { account: getAddress(accounts[0]) });
    }
    onChainChanged(chainId) {
        const id = normalizeChainId(chainId);
        const unsupported = this.isChainUnsupported(id);
        this.emit('change', { chain: { id, unsupported } });
    }
    async getChainId() {
        const provider = await this.getProvider();
        if (provider) {
            const chainId = await provider.request({
                method: 'eth_chainId',
                params: [],
            });
            return normalizeChainId(chainId);
        }
        const networkOptions = this.options.magicSdkConfiguration?.network;
        if (typeof networkOptions === 'object') {
            const chainID = networkOptions.chainId;
            if (chainID)
                return normalizeChainId(chainID);
        }
        throw new Error('Chain ID is not defined');
    }
    onDisconnect() {
        this.emit('disconnect');
    }
    async disconnect() {
        try {
            const magic = this.getMagicSDK();
            await magic?.wallet.disconnect();
            this.emit('disconnect');
        }
        catch (error) {
            console.error('Error disconnecting from Magic SDK:', error);
        }
    }
}
