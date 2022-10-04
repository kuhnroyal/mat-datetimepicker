module.exports = {
  branches: ['release'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        pkgRoot: 'projects/core',
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/core',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        pkgRoot: 'projects/moment',
      },
    ],
    [
      '@semantic-release/npm',
      {
        pkgRoot: 'dist/moment',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'projects/**/package.json'],
        message:
          'chore(release): ${nextRelease.version}\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          { path: 'CHANGELOG.md' },
          { path: 'LICENSE' },
          { path: 'README.md' },
        ],
      },
    ],
  ],
};
