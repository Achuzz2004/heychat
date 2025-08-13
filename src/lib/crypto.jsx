export async function generateChatKey() {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

export async function exportKeyBase64(key) {
  const raw = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

export async function importKeyBase64(b64) {
  const raw = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}

export async function encryptText(key, plain) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder().encode(plain);
  const ctBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc);
  const ct = btoa(String.fromCharCode(...new Uint8Array(ctBuf)));
  const ivb64 = btoa(String.fromCharCode(...iv));
  return { v: 1, iv: ivb64, ct };
}

export async function decryptText(key, payload) {
  const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0));
  const ct = Uint8Array.from(atob(payload.ct), c => c.charCodeAt(0));
  const ptBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(ptBuf);
}

export function getStoredChatKey(chatId) {
  const b64 = localStorage.getItem(`chat_key_${chatId}`);
  if (!b64) return Promise.resolve(null);
  return importKeyBase64(b64);
}

export async function ensureChatKey(chatId) {
  const existing = await getStoredChatKey(chatId);
  if (existing) return existing;
  const key = await generateChatKey();
  const b64 = await exportKeyBase64(key);
  localStorage.setItem(`chat_key_${chatId}`, b64);
  return key;
}
