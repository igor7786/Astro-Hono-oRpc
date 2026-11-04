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
  'ui:3xui': ThreeXuiIcon,
  'logos:nginx': NginxIcon,
  'selfhst:crowdsec': CrowdsecIcon,
  'selfhst:arcane': ArcaneIcon,
  'ui:redpanda': RedpandaIcon,
  'selfhst:rustfs': RustfsIcon,
  'lucide:logs': LogsIcon,
  'ui:dragonfly': DragonflyIcon,
  'logos:neon-icon': NeonIcon,
  'logos:postgresql': PostgresqlIcon,
  'logos:sqlite': SqliteIcon,
  'logos:bun': BunIcon,
  'skill-icons:vite-light': ViteIcon,
  'skill-icons:astro': AstroIcon,
  'logos:hono': HonoIcon,
  'ui:orpc': OrpcIcon,
  'logos:zod': ZodIcon,
  'logos:react-query-icon': ReactQueryIcon,
  'ui:drizzle': DrizzleIcon,
  'logos:tailwindcss-icon': TailwindIcon,
  'logos:react': ReactIcon,
  'ui:nanostores': NanostoresIcon,
  'simple-icons:ionos': IonosIcon,
  'selfhst:authentik': AuthentikIcon,
  'simple-icons:scalar': ScalarIcon,
};

// Unified single source of truth configuration type
export interface Technology {
  name: string;
  icon: IconComponentType; // 💡 Component variable reference
  route: string;
  label: string;
  size: number;
}

export const technologies: Technology[] = [
  {
    name: 'IONOS',
    icon: IonosIcon,
    route: 'https://www.ionos.co.uk/',
    label: 'Ionos-Admin',
    size: 28,
  },
  {
    name: '3X-UI',
    icon: ThreeXuiIcon,
    route: 'https://3xui.fast-web-tech.co.uk/',
    label: '3xui-Admin',
    size: 32,
  },
  {
    name: 'Arcane',
    icon: ArcaneIcon,
    route: 'https://arcane.fast-web-tech.co.uk/',
    label: 'Arcane',
    size: 24,
  },
  {
    name: 'Nginx',
    icon: NginxIcon,
    route: 'https://npm.fast-web-tech.co.uk/',
    label: 'Npm Admin',
    size: 24,
  },
  {
    name: 'CrowdSec',
    icon: CrowdsecIcon,
    route: 'https://crowdsec.fast-web-tech.co.uk/',
    label: 'Crowdsec-Admin',
    size: 24,
  },
  {
    name: 'Redpanda',
    icon: RedpandaIcon,
    route: 'https://redpanda-console.fast-web-tech.co.uk/',
    label: 'Redpanda-Console',
    size: 24,
  },
  {
    name: 'Neon',
    icon: NeonIcon,
    route: 'https://neon.com/',
    label: 'Neon-Admin',
    size: 24,
  },
  {
    name: 'Dragonfly',
    icon: DragonflyIcon,
    route: 'https://redis-insight.fast-web-tech.co.uk/',
    label: 'Dragonfly-Console',
    size: 28,
  },
  {
    name: 'RustFS',
    icon: RustfsIcon,
    route: 'https://rustfs.fast-web-tech.co.uk/',
    label: 'Rustfs-Admin',
    size: 24,
  },
  {
    name: 'Authentik',
    icon: AuthentikIcon,
    route: 'https://auth.fast-web-tech.co.uk/',
    label: 'Authentik-Admin',
    size: 24,
  },
  {
    name: 'Logs',
    icon: LogsIcon, // 💡 Assigned static component directly
    route: 'https://logs.fast-web-tech.co.uk/',
    label: 'Logs-Admin',
    size: 24,
  },
  {
    name: 'Scalar',
    icon: ScalarIcon, // 💡 Assigned static component directly
    route: '/api/docs',
    label: 'OpenAPI Docs',
    size: 24,
  },
];
