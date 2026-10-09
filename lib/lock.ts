// L'horloge du SERVEUR décide, jamais le client.
export const isUnlocked = (unlockAt: Date) => Date.now() >= unlockAt.getTime();

export function publicState(unlockAt: Date) {
  const days = Math.ceil((unlockAt.getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return "open" as const;
  if (days === 1) return "tomorrow" as const;
  return "waiting" as const;
}
