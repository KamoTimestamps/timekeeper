// Userscript release channels. `main` is the published build; other channels are installed from
// their own branch and update from it. Backend settings are injected at build time, so the
// default build ships with sync unconfigured.
module.exports = {
  main: {
    outputFile: 'timekeeper.user.js', // also written to ts.user.js (legacy install URL)
    branch: 'main',
    syncApiUrl: '',
    syncGoogleClientId: '',
  },
  devel: {
    outputFile: 'timekeeper.devel.user.js',
    branch: 'devel',
    // Each build gets a 4th version component (commit count) so userscript managers see an update.
    versionFromCommitCount: true,
    // Show the short commit hash next to the version in the UI and logs, e.g. v5.3.1+a1b2c3d.
    displayCommitHash: true,
    syncApiUrl: 'https://devel.kamotimestamps.com',
    syncGoogleClientId: '308989572223-cdnvpn65mc51oqneu7po3og51uf5ahsb.apps.googleusercontent.com',
  },
};
