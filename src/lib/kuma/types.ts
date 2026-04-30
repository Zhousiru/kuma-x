export type HeartbeatStatus = 0 | 1 | 2 | 3;

export type Heartbeat = {
  status: HeartbeatStatus;
  time: string;
  msg: string;
  ping: number | null;
};

export type MonitorTag = {
  id?: number;
  name?: string;
  value?: string;
  color?: string;
};

export type Monitor = {
  id: number;
  name: string;
  type: string;
  sendUrl: 0 | 1;
  url?: string;
  tags?: MonitorTag[];
  certExpiryDaysRemaining?: number | string;
  validCert?: boolean | null;
};

export type MonitorGroup = {
  id: number;
  name: string;
  monitorList: Monitor[];
};

export type StatusPageConfig = {
  title: string;
  description: string | null;
  autoRefreshInterval: number;
  showPoweredBy: boolean;
  footerText: string | null;
  showTags: boolean;
  showCertificateExpiry: boolean;
  showOnlyLastHeartbeat: boolean;
};

export type IncidentStyle =
  | "info"
  | "warning"
  | "danger"
  | "primary"
  | "light"
  | "dark";

export type Incident = {
  id: number;
  title: string;
  content: string;
  style: IncidentStyle;
  pin: boolean;
  active: boolean;
  createdDate: string;
  lastUpdatedDate: string | null;
};

export type MaintenanceStatus =
  | "under-maintenance"
  | "scheduled"
  | "ended"
  | "unknown"
  | "inactive";

export type MaintenanceTimeslot = {
  startDate: string;
  endDate: string;
};

export type Maintenance = {
  id: number;
  title: string;
  description: string;
  strategy: string;
  status: MaintenanceStatus;
  active: boolean;
  timeslotList: MaintenanceTimeslot[];
  timezone: string | null;
  timezoneOffset: string | null;
};

export type StatusPagePayload = {
  config: StatusPageConfig;
  incidents: Incident[];
  maintenanceList: Maintenance[];
  publicGroupList: MonitorGroup[];
};

export type HeartbeatPayload = {
  heartbeatList: Record<string, Heartbeat[]>;
  uptimeList: Record<string, number>;
};

export type IncidentHistoryPayload = {
  ok: boolean;
  incidents: Incident[];
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
};
