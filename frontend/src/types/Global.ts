export {};

declare global {
	interface Window {
		ethereum?: Eip1193Provider;
	}
}

interface RequestArguments {
	method: string;
	params?: Array<unknown> | Record<string, unknown>;
}

interface Eip1193Provider {
	request: (request: RequestArguments) => Promise<unknown>;
	on?: (eventName: string, handler: (params?: unknown) => void) => void;
	removeListener?: (eventName: string, handler: (params?: unknown) => void) => void;
	// Add any additional methods you need
	isMetaMask?: boolean;
	selectedAddress?: string;
	chainId?: string;
	isConnected?: () => boolean;
}
