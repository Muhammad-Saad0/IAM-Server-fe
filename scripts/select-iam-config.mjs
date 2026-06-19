import { copyFileSync, existsSync, readFileSync } from 'node:fs';

const configEnvironment = readConfigEnvironment();
const source = `public/iam-config.${configEnvironment}.js`;
const target = 'public/iam-config.js';

if (!existsSync(source)) {
  fail(`IAM config file not found: ${source}`);
}

copyFileSync(source, target);
console.log(`Selected ${source}`);

function readConfigEnvironment() {
  const dotEnv = readEnvFile('.env');
  const value = process.env.IAM_CONFIG_ENV ?? dotEnv.IAM_CONFIG_ENV ?? 'local';
  const configEnvironment = value.trim().toLowerCase();

  if (!['local', 'sandbox'].includes(configEnvironment)) {
    fail('Invalid IAM_CONFIG_ENV "' + value + '". Expected one of: local, sandbox');
  }

  return configEnvironment;
}

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

function fail(message) {
  console.error(message);
  process.exit(1);
}
