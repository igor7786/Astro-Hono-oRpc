// src/app/lib/icons/static-icon-map.ts
import type React from 'react';

// 🔌 Static imports via unplugin-icons
import BunIcon from '~icons/logos/bun';
import HonoIcon from '~icons/logos/hono';
import NeonIcon from '~icons/logos/neon-icon';
import NginxIcon from '~icons/logos/nginx';
import PostgresqlIcon from '~icons/logos/postgresql';
import ReactIcon from '~icons/logos/react';
import ReactQueryIcon from '~icons/logos/react-query-icon';
import SqliteIcon from '~icons/logos/sqlite';
import TailwindIcon from '~icons/logos/tailwindcss-icon';
import ZodIcon from '~icons/logos/zod';
import LogsIcon from '~icons/lucide/logs';
import ArcaneIcon from '~icons/selfhst/arcane';
import AuthentikIcon from '~icons/selfhst/authentik';
import CrowdsecIcon from '~icons/selfhst/crowdsec';
import RustfsIcon from '~icons/selfhst/rustfs';
import IonosIcon from '~icons/simple-icons/ionos';
import ScalarIcon from '~icons/simple-icons/scalar';
import AstroIcon from '~icons/skill-icons/astro';
import ViteIcon from '~icons/skill-icons/vite-light';
import ThreeXuiIcon from '~icons/ui/3xui';
import DragonflyIcon from '~icons/ui/dragonfly';
import DrizzleIcon from '~icons/ui/drizzle';
import NanostoresIcon from '~icons/ui/nanostores';
import OrpcIcon from '~icons/ui/orpc';
import RedpandaIcon from '~icons/ui/redpanda';

export type IconComponentType = React.ComponentType<{
  width?: number;
  height?: number;
  className?: string;
  role?: string;
  'aria-label'?: string;
}>;

// 🗺️ Exported map table
export const STATIC_ICON_MAP: Record<string, IconComponentType> = {
  'logos:nginx': NginxIcon,
  'simple-icons:scalar': ScalarIcon,
  'selfhst:crowdsec': CrowdsecIcon,
  'logos:bun': BunIcon,
  'skill-icons:astro': AstroIcon,
  'ui:redpanda': RedpandaIcon,
  'logos:hono': HonoIcon,
  'ui:orpc': OrpcIcon,
  'logos:zod': ZodIcon,
  'selfhst:rustfs': RustfsIcon,
  'logos:postgresql': PostgresqlIcon,
  'logos:neon-icon': NeonIcon,
  'logos:sqlite': SqliteIcon,
  'ui:dragonfly': DragonflyIcon,
  'skill-icons:vite-light': ViteIcon,
  'logos:react-query-icon': ReactQueryIcon,
  'ui:drizzle': DrizzleIcon,
  'logos:tailwindcss-icon': TailwindIcon,
  'logos:react': ReactIcon,
  'ui:nanostores': NanostoresIcon,
  'ui:3xui': ThreeXuiIcon,
  'simple-icons:ionos': IonosIcon,
  'selfhst:arcane': ArcaneIcon,
  'selfhst:authentik': AuthentikIcon,
  'lucide:logs': LogsIcon,
};

export const technologies = [
  { name: 'Nginx', Icon: NginxIcon },
  { name: 'CrowdSec', Icon: CrowdsecIcon },
  { name: 'Bun', Icon: BunIcon },
  { name: 'Astro', Icon: AstroIcon },
  { name: 'Redpanda', Icon: RedpandaIcon },
  { name: 'Hono', Icon: HonoIcon },
  { name: 'oRPC', Icon: OrpcIcon },
  { name: 'Zod', Icon: ZodIcon },
  { name: 'RustFS', Icon: RustfsIcon },
  { name: 'PostgreSQL', Icon: PostgresqlIcon },
  { name: 'Neon', Icon: NeonIcon },
  { name: 'SQLite', Icon: SqliteIcon },
  { name: 'Dragonfly', Icon: DragonflyIcon },
  { name: 'Vite', Icon: ViteIcon },
  { name: 'TanStack Query', Icon: ReactQueryIcon },
  { name: 'Drizzle', Icon: DrizzleIcon },
  { name: 'Tailwind CSS', Icon: TailwindIcon },
  { name: 'React', Icon: ReactIcon },
  { name: 'Nano Stores', Icon: NanostoresIcon },
  { name: '3X-UI', Icon: ThreeXuiIcon },
];
