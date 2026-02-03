import type { ForgeConfig } from '@electron-forge/shared-types';
import path from 'path';
import { rebuild } from '@electron/rebuild';


const config: ForgeConfig = {
  packagerConfig: {
      name:"from-scratch-electron-angular",
      asar: true
      //{
      //  unpack: '**/node_modules/better-sqlite3/**',
      //},
  },
  rebuildConfig: { /* ... */ },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      config: {},
      platforms: ['win32']
    }
  ],
  publishers: [],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
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
  outDir: '../dist/electron-builds'
};

export default config;


//#region Additional makers for other OS
  // apple
  //{
  //  name: '@electron-forge/maker-zip',
  //  platforms: ['darwin'],
  //  config: {}
  //},
  // debian/ubuntu
  //{
  //  name: '@electron-forge/maker-deb',
  //  config: {},
  //},
  // RedHat/Fedora
  //{
  //  name: '@electron-forge/maker-rpm',
  //  config: {},
  //},
//#endregion

//#region Additional Security Config
  //const { FusesPlugin } = require('@electron-forge/plugin-fuses');
  //const { FuseV1Options, FuseVersion } = require('@electron/fuses');
  // Fuses are used to enable/disable various Electron functionality
  // at package time, before code signing the application
  //new FusesPlugin({
  //  version: FuseVersion.V1,
  //  [FuseV1Options.RunAsNode]: false,
  //  [FuseV1Options.EnableCookieEncryption]: true,
  //  [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
  //  [FuseV1Options.EnableNodeCliInspectArguments]: false,
  //  [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
  //  [FuseV1Options.OnlyLoadAppFromAsar]: true,
  //}),
//#endregion
