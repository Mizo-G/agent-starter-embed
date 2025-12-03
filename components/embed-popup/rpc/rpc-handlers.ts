import type { Room } from 'livekit-client';

export function registerClientRpcHandlers(room: Room) {
  room.registerRpcMethod('client.click_button', async (data) => {
    try {
      const payload = JSON.parse(data.payload ?? '{}');
      const jsId = payload.jsId;

      if (!jsId) {
        console.warn('client.clickElement RPC missing jsId');
        return JSON.stringify({ ok: false, error: 'Missing jsId' });
      }
      const selector = `[data-js-id="${jsId}"]`;
      const el = document.querySelector(selector) as HTMLElement | null;

      if (!el) {
        console.warn(`Element not found for selector: ${selector}`);
        return JSON.stringify({ ok: false, error: 'Element not found' });
      }

      el.click();
      return JSON.stringify({ ok: true });
    } catch (err) {
      const error = err as Error;
      console.error('client.clickElement handler error:', err);
      return JSON.stringify({ ok: false, error: error.message });
    }
  });

  room.registerRpcMethod('client.greet', async (data) => {
    console.log('[RPC] greet →', data);
    return `Hello ${data.callerIdentity}!`;
  });
}

export function unregisterClientRpcHandlers(room: Room) {
  room.unregisterRpcMethod('client.greet');
  room.unregisterRpcMethod('client.click_button');
}
