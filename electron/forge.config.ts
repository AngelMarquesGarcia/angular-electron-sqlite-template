import type { ForgeConfig } from '@electron-forge/shared-types';
import { execSync } from 'child_process';
import path from 'path';
import { rebuild } from '@electron/rebuild';


const config: ForgeConfig = {
  packagerConfig: {
      name:"from-scratch-electron-angular",
      asar: {
        unpack: '**/node_modules/better-sqlite3/**',
      },
  },
  rebuildConfig: { /* ... */ },
  makers: [{
    name: '@electron-forge/maker-squirrel',
    config: {
      name: 'my_app'
    }
  }],
  publishers: [],
  plugins: [],
  hooks: { prePackage: async () => {
      await rebuild({
        buildPath: path.resolve(__dirname),
        onlyModules: ['better-sqlite3'],
        force: true,
        electronVersion:"40.0.0"
      });
    },
  },
  buildIdentifier: 'my-build',
  outDir: './dist/electron-builds'
};

export default config;

