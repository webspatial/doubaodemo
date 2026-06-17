import type { Dispatch, SetStateAction } from 'react';

export function appendLog(
  message: string,
  setLogs: Dispatch<SetStateAction<string[]>>,
) {
  const time = new Date().toLocaleTimeString();
  setLogs((prev) => [`[${time}] ${message}`, ...prev].slice(0, 40));
}

export function getParentLabel(element: HTMLElement | null) {
  if (!element?.parentElement) {
    return 'unknown';
  }

  return (
    element.parentElement.dataset.name ||
    element.parentElement.className ||
    element.parentElement.tagName.toLowerCase()
  );
}

export function getPortalContainer() {
  return document.getElementById('root') ?? undefined;
}
