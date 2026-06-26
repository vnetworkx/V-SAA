const fs = require('node:fs');
const path = require('node:path');

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'guild-config.json');

function ensureFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
  }
}

function readAll() {
  ensureFile();
  const raw = fs.readFileSync(dataFile, 'utf8');
  return JSON.parse(raw || '{}');
}

function writeAll(data) {
  ensureFile();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function defaultGuildConfig() {
  return {
    welcomeChannelId: null,
    logChannelId: null,
    autoRoleId: null,
    welcomeTitle: 'Welcome to {server}!',
    welcomeDescription: 'Hey {user}, welcome to **{server}**! Take a look around and enjoy your stay.'
  };
}

function getGuildConfig(guildId) {
  const all = readAll();
  if (!all[guildId]) {
    all[guildId] = defaultGuildConfig();
    writeAll(all);
  }
  return all[guildId];
}

function updateGuildConfig(guildId, patch) {
  const all = readAll();
  if (!all[guildId]) {
    all[guildId] = defaultGuildConfig();
  }
  all[guildId] = {
    ...defaultGuildConfig(),
    ...all[guildId],
    ...patch
  };
  writeAll(all);
  return all[guildId];
}

module.exports = {
  getGuildConfig,
  updateGuildConfig,
  defaultGuildConfig
};
