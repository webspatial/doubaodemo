// Auto-installed by the `webspatial-local-sdk-link` skill.
// Copy this file to <app>/vite/webspatial-config.ts and reference it from vite.config.ts.
//
// Behavior:
//   - When WEBSPATIAL_SDK_PATH (env var or .env*) is unset, this is a no-op:
//     Vite resolves @webspatial/* from node_modules just like any other npm dep.
//   - When set, it injects everything required to load the SDK from local source:
//       resolve.alias for @webspatial/{core-sdk,react-sdk} (+ jsx-runtime and lazy-load subpaths)
//       optimizeDeps.exclude so Vite does not prebundle them
//       server.fs.allow so Vite is allowed to serve files outside the project root
//       define for __WEBSPATIAL_*_SDK_VERSION__ globals (read from local SDK package.json)
//
// CI / fresh clones do not need to do anything - WEBSPATIAL_SDK_PATH is simply absent.
//
// Note on __WEBSPATIAL_*_SDK_VERSION__:
//   These are SDK-internal symbols. The helper injects them ONLY in LOCAL mode
//   so the SDK source files (which reference them directly) can be bundled. In
//   NPM mode, the published SDK dist already has them inlined, so app code that
//   imports from @webspatial/* sees the right value with no help from us.
//   If your app references these globals directly (rare), add an NPM-mode
//   fallback in your own vite.config.ts -- see examples/webspatial-local-sdk-link/
//   vite-app/vite.config.ts for the readInstalledVersion + define recipe.

import path from 'node:path'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import {
  loadEnv,
  mergeConfig,
  type ConfigEnv,
  type UserConfig,
  type UserConfigFnObject,
} from 'vite'

const ENV_VAR = 'WEBSPATIAL_SDK_PATH'

// Decision (a): only manage these two packages.
const PACKAGE_TO_SUBPATH: Record<string, string> = {
  '@webspatial/core-sdk': 'packages/core',
  '@webspatial/react-sdk': 'packages/react',
}

export type DefineWebSpatialConfigOptions = {
  /**
   * Your project's Vite config (everything except the SDK link plumbing).
   * May be either a static UserConfig or a function that receives the Vite ConfigEnv.
   */
  base?: UserConfig | ((env: ConfigEnv) => UserConfig)
}

/**
 * Wraps a project's Vite config and injects local SDK aliases when WEBSPATIAL_SDK_PATH is set.
 *
 * Usage:
 *
 *   import { defineConfig } from 'vite'
 *   import react from '@vitejs/plugin-react'
 *   import { defineWebSpatialConfig } from './vite/webspatial-config'
 *
 *   export default defineConfig(
 *     defineWebSpatialConfig({
 *       base: { plugins: [react()], server: { host: true } },
 *     }),
 *   )
 */
export function defineWebSpatialConfig(
  opts: DefineWebSpatialConfigOptions = {},
): UserConfigFnObject {
  return (env: ConfigEnv): UserConfig => {
    const base = typeof opts.base === 'function' ? opts.base(env) : (opts.base ?? {})

    const sdkPath = resolveSdkPath(env.mode)
    if (!sdkPath) return base

    const overrides = buildLocalSdkOverrides(sdkPath)
    return mergeConfig(base, overrides) as UserConfig
  }
}

function resolveSdkPath(mode: string): string | null {
  // process.env wins so callers can override per-invocation:
  //   WEBSPATIAL_SDK_PATH=/tmp/sdk pnpm dev
  if (process.env[ENV_VAR]) return path.resolve(process.env[ENV_VAR] as string)

  // Fall back to .env / .env.local etc.
  const fileEnv = loadEnv(mode, process.cwd(), ['WEBSPATIAL_'])
  if (fileEnv[ENV_VAR]) return path.resolve(fileEnv[ENV_VAR])
  return null
}

function buildLocalSdkOverrides(sdkRoot: string): UserConfig {
  if (!fs.existsSync(path.join(sdkRoot, 'package.json'))) {
    // Soft-fail: warn but do nothing destructive. Lets the dev server still start.
    console.warn(
      `[webspatial-config] ${ENV_VAR}=${sdkRoot} is set but no package.json found there. Falling back to npm mode.`,
    )
    return {}
  }

  const corePath = path.join(sdkRoot, PACKAGE_TO_SUBPATH['@webspatial/core-sdk'])
  const reactPath = path.join(sdkRoot, PACKAGE_TO_SUBPATH['@webspatial/react-sdk'])

  const coreVersion = readPackageVersion(corePath) ?? 'local-dev'
  const reactVersion = readPackageVersion(reactPath) ?? 'local-dev'

  // We inject the version constants in BOTH `define` and `oxc.define`:
  //   - `define` covers production builds (Rollup) and SSR in dev.
  //   - `oxc.define` is what actually runs for client code in dev (Vite v5+ moved JS/TS
  //     transform to Oxc, and the vite:define plugin skips the client environment in dev).
  //     We use `oxc.define` (not `esbuild.define`) because @vitejs/plugin-react sets
  //     `config.oxc`, which causes Vite to ignore any `esbuild` block.
  const versionDefines = {
    __WEBSPATIAL_CORE_SDK_VERSION__: JSON.stringify(coreVersion),
    __WEBSPATIAL_REACT_SDK_VERSION__: JSON.stringify(reactVersion),
  }

  // Resolve `scheduler` to an absolute path. Background: `scheduler` is a transitive
  // dep of `react-dom` and is NOT a direct dep of the host app. With pnpm (default
  // strict layout) the only copy on disk lives under
  // `node_modules/.pnpm/scheduler@<v>/node_modules/scheduler`, unreachable by name
  // from the app root. In LOCAL mode our SDK source pulls in react-dom transitively
  // and Vite re-prebundles react-dom via rolldown; rolldown asks the resolver for
  // `scheduler`, the resolver fails, and rolldown emits `__require("scheduler")` --
  // a runtime CJS require that crashes the browser with:
  //   'Calling `require` for "scheduler" in an environment that doesn't expose
  //    the `require` function'.
  // Resolving it from react-dom's location works in any package manager because
  // react-dom always has scheduler as a sibling.
  const schedulerDir = resolveSchedulerDir(process.cwd())
  const hostReactAliases = resolveHostReactAliases(process.cwd())

  return {
    define: versionDefines,
    oxc: { define: versionDefines },
    resolve: {
      // false so pnpm transitive deps (e.g. @radix-ui/*) resolve from the app root;
      // SDK imports are already handled via explicit aliases above, not symlinks.
      preserveSymlinks: false,
      dedupe: ['react', 'react-dom'],
      alias: [
        ...hostReactAliases,
        {
          find: /^@webspatial\/react-sdk\/internal\/facades-client$/,
          replacement: path.join(reactPath, 'src/internal/facades-client.ts'),
        },
        {
          find: /^@webspatial\/react-sdk\/jsx-runtime$/,
          replacement: path.join(reactPath, 'src/jsx/jsx-runtime.ts'),
        },
        {
          find: /^@webspatial\/react-sdk\/jsx-dev-runtime$/,
          replacement: path.join(reactPath, 'src/jsx/jsx-dev-runtime.ts'),
        },
        {
          find: /^@webspatial\/react-sdk$/,
          replacement: path.join(reactPath, 'src/index.ts'),
        },
        {
          find: /^@webspatial\/core-sdk\/runtime$/,
          replacement: path.join(corePath, 'src/runtime/index.ts'),
        },
        {
          find: /^@webspatial\/core-sdk\/install-polyfills$/,
          replacement: path.join(corePath, 'src/install-polyfills.ts'),
        },
        {
          find: /^@webspatial\/core-sdk$/,
          replacement: path.join(corePath, 'src/index.ts'),
        },
        ...(schedulerDir
          ? [{ find: /^scheduler$/, replacement: schedulerDir }]
          : []),
      ],
    },
    optimizeDeps: {
      exclude: [
        '@webspatial/react-sdk',
        '@webspatial/react-sdk/jsx-runtime',
        '@webspatial/react-sdk/jsx-dev-runtime',
        '@webspatial/react-sdk/internal/facades-client',
        '@webspatial/core-sdk',
        '@webspatial/core-sdk/runtime',
        '@webspatial/core-sdk/install-polyfills',
      ],
    },
    server: {
      fs: {
        allow: [sdkRoot, process.cwd()],
      },
    },
  }
}

function resolveHostReactAliases(appCwd: string): NonNullable<UserConfig['resolve']>['alias'] {
  const appRequire = createRequire(path.join(appCwd, 'package.json'))
  const entries = [
    ['react', 'react'],
    ['react/jsx-runtime', 'react/jsx-runtime'],
    ['react/jsx-dev-runtime', 'react/jsx-dev-runtime'],
    ['react-dom', 'react-dom'],
    ['react-dom/client', 'react-dom/client'],
    ['react-dom/server', 'react-dom/server'],
  ] as const

  return entries.flatMap(([specifier, packageEntry]) => {
    try {
      return [
        {
          find: new RegExp(`^${escapeRegExp(specifier)}$`),
          replacement: appRequire.resolve(packageEntry),
        },
      ]
    } catch {
      return []
    }
  })
}

// Resolve scheduler relative to the host app's react-dom (where scheduler always lives
// as a direct dep). Returns the package directory or null if it cannot be located,
// in which case we silently skip the alias and let any caller-provided alias win.
function resolveSchedulerDir(appCwd: string): string | null {
  try {
    const appRequire = createRequire(path.join(appCwd, 'package.json'))
    const reactDomPkgJson = appRequire.resolve('react-dom/package.json')
    const reactDomRequire = createRequire(reactDomPkgJson)
    const schedulerPkgJson = reactDomRequire.resolve('scheduler/package.json')
    return path.dirname(schedulerPkgJson)
  } catch {
    return null
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function readPackageVersion(packageDir: string): string | null {
  try {
    const raw = fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')
    const parsed = JSON.parse(raw) as { version?: string }
    return parsed.version ?? null
  } catch {
    return null
  }
}
