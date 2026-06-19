import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const env = readEnvFile('.env');

const issuer = env.IAM_ISSUER ?? 'http://localhost:8080';
const apiBaseUrl = env.IAM_API_BASE_URL ?? `${issuer.replace(/\/+$/, '')}/api/management`;

writeFileSync(
  'public/iam-config.js',
  `window.__IAM_CONFIG__ = ${JSON.stringify(
    {
      issuer,
      apiBaseUrl,
    },
    null,
    2,
  )};\n`,
);

function readEnvFile(path) {
  if (!existsSync(path)) {
    return {};
  }

  return readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((values, line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) {
        return values;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      values[key] = unquote(value);
      return values;
    }, {});
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
