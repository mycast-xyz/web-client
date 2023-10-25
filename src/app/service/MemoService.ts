import axios from 'axios';
import { writable, type Readable, type Writable } from 'svelte/store';
import type { Memo } from '../model/memo/Memo';
import { VegaMemoLoader } from '../model/memo/loader/VegaMemoLoader';
import { SessionService } from './SessionService';

class MemoServiceInit {
	#memos: Writable<Memo[]> = writable([]);
	#currentMemo: Writable<Memo | null> = writable(null);

	#loader = new VegaMemoLoader();

	get memos(): Readable<Memo[]> {
		return this.#memos;
	}

	get currentMemo(): Readable<Memo | null> {
		return this.#currentMemo;
	}

	setCurrentMemo(memo: Memo | null) {
		this.#currentMemo.set(memo);
	}

	async uploadMemo(memo: string): Promise<void> {
		const url = 'https://mycast.xyz:9011/memo';
		const form = {
			userKey: SessionService.getPrivateKey(),
			text: memo
		};
		await axios.post(url, form);

		this.refresh();
	}

	async shareMemo(memoHash: string) {
		const url = 'https://mycast.xyz:8002/memo';
		const privKey = SessionService.getPrivateKey();
		await axios.post(url, {
			user: privKey,
			memoIdx: Number(memoHash)
		});
	}

	async refresh() {
		this.#memos.set(await this.#loader.load());
	}
}

export const MemoService = new MemoServiceInit();
