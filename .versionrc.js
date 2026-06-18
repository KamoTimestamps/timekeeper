module.exports = {
  compareUrlFormat: 'https://github.com/KamoTimestamps/timekeeper/compare/{{previous}}...{{current}}',
  types: [
    { type: 'feat', section: 'Added' },
    { type: 'fix', section: 'Fixed' },
    { type: 'refactor', section: 'Changed' },
    { type: 'chore', section: 'Changed' },
    { type: 'style', section: 'Changed' },
    { type: 'docs', section: 'Changed' },
    { type: 'perf', section: 'Changed' }
  ],
  issueUrlFormat: 'https://github.com/KamoTimestamps/timekeeper/issues/{{id}}',
  issuePrefixes: ['#'],
  packageFiles: [
    'package.json',
    {
      filename: 'manifest.json',
      type: 'json'
    }
  ]
};
