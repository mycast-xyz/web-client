import { browser } from '$app/environment';

export class SessionStorageModel {
	get #storage(): Storage | null {
		return browser ? sessionStorage : null;
	}

	set privateKey(privateKey: string) {
		this.#storage?.setItem('privateKey', privateKey);
	}

	get privateKey(): string {
		return this.#storage?.getItem('privateKey') || '';
	}
}
