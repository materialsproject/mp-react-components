/**
 *
 * A very simple and naive singleton event bus.
 *
 */

import { Subject, Subscription } from 'rxjs';
import { ExportType } from './constants';
interface DownloadRequestEvent {
  filename: string;
  filetype: ExportType;
}

const eventBus: Subject<DownloadRequestEvent> = new Subject<DownloadRequestEvent>();

export function triggerDownloadRequest(downloadRequest: DownloadRequestEvent) {
  eventBus.next(downloadRequest);
}

export function subscribe(cb: (event: DownloadRequestEvent) => void): Subscription {
  return eventBus.asObservable().subscribe(event => cb(event));
}
