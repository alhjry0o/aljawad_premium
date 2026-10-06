import type { ServiceIconKey } from './services';

export type RequestKind = 'service' | 'quote' | 'inspection';

export type RequestStatus =
  | 'submitted'
  | 'received'
  | 'review'
  | 'awaiting_inspection'
  | 'preparing_quote'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface RequestLocation {
  city: string;
  district: string;
  address: string;
  extra?: string;
}

export interface RequestSchedule {
  date: string;
  time: string;
}

export interface RequestContact {
  name: string;
  phone: string;
}

export interface TimelineEntry {
  status: RequestStatus;
  at: string;
}

export interface AppRequest {
  id: string;
  /** Human readable reference, e.g. JW-2419 */
  reference: string;
  kind: RequestKind;
  serviceId: ServiceIconKey;
  propertyType?: string;
  location: RequestLocation;
  schedule?: RequestSchedule;
  notes?: string;
  /** Local-only data URLs of attached photos */
  photos: string[];
  contact: RequestContact;
  /** Dynamic, service-dependent fields (quotation flow) */
  specs?: Record<string, string>;
  status: RequestStatus;
  timeline: TimelineEntry[];
  createdAt: string;
}

/** Domain contract — a Remote implementation can replace the local one. */
export interface RequestRepository {
  list(): Promise<AppRequest[]>;
  create(input: Omit<AppRequest, 'id' | 'reference' | 'status' | 'timeline' | 'createdAt'>): Promise<AppRequest>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_KEY = 'aljawad.requests.v1';

const read = (): AppRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AppRequest[]) : [];
  } catch {
    return [];
  }
};

const write = (items: AppRequest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage quota — demo build keeps working in memory */
  }
};

const makeReference = (): string => `JW-${Math.floor(1000 + Math.random() * 8999)}`;

export class LocalRequestRepository implements RequestRepository {
  async list(): Promise<AppRequest[]> {
    return read();
  }

  async create(
    input: Omit<AppRequest, 'id' | 'reference' | 'status' | 'timeline' | 'createdAt'>,
  ): Promise<AppRequest> {
    const now = new Date().toISOString();
    const request: AppRequest = {
      ...input,
      id: `req_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      reference: makeReference(),
      status: 'submitted',
      timeline: [{ status: 'submitted', at: now }],
      createdAt: now,
    };
    write([request, ...read()]);
    return request;
  }

  async remove(id: string): Promise<void> {
    write(read().filter((r) => r.id !== id));
  }

  async clear(): Promise<void> {
    write([]);
  }
}

export const requestRepository: RequestRepository = new LocalRequestRepository();
