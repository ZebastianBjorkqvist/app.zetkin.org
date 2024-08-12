import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';

import { AnyMessage, MessageMap } from 'core/i18n/messages';

run();

async function run() {
  let full: Record<string, string> = {};

  for await (const messageFilePath of findMessageFiles('./src')) {
    // Find path relative to src folder
    const relativeFilePath = path.relative('./src', messageFilePath);

    // Remove the .ts suffix
    const modulePath = relativeFilePath.slice(0, -3);

    // Dynamically import message map
    const messageIdsImport = await import(modulePath);
    const messageIds = messageIdsImport.default;

    const flatList = flattenMessageMap(messageIds);
    full = { ...full, ...flatList };
  }

  const fullObj = objFromIdMap(full);
  const serialized = yaml.stringify(fullObj, { sortMapEntries: true });
  const output = [
    '# Auto-generated by `yarn make-yaml`. Do not edit!',
    serialized,
  ].join('\n');

  await fs.mkdir('./src/locale', { recursive: true });
  await fs.writeFile('./src/locale/en.yml', output);
}

function objFromIdMap(map: Record<string, string>): RecursiveStringMap {
  const output: RecursiveStringMap = {};

  Object.entries(map).forEach(([id, val]) => {
    const path = id.split('.');
    let parent = output;
    path.forEach((elem, index) => {
      const isLast = index == path.length - 1;
      if (isLast) {
        parent[elem] = val;
      } else {
        if (!parent[elem]) {
          parent[elem] = {};
        }
        parent = parent[elem] as RecursiveStringMap;
      }
    });
  });

  return output;
}

function flattenMessageMap(map: MessageMap, flat: Record<string, string> = {}) {
  Object.values(map).forEach((val) => {
    if (isMessage(val)) {
      flat[val._id] = val._defaultMessage;
    } else {
      flattenMessageMap(val, flat);
    }
  });

  return flat;
}

function isMessage(obj: AnyMessage | MessageMap): obj is AnyMessage {
  return !!obj._id;
}

interface RecursiveStringMap {
  [key: string]: string | RecursiveStringMap;
}

async function* findMessageFiles(dir: string): AsyncIterable<string> {
  const dirEnts = await fs.readdir(dir, { withFileTypes: true });
  for (const dirEnt of dirEnts) {
    const res = path.resolve(dir, dirEnt.name);
    if (dirEnt.isDirectory()) {
      yield* findMessageFiles(res);
    } else if (
      res.endsWith('messageIds.ts') ||
      res.endsWith('globalMessageIds.ts')
    ) {
      yield res;
    }
  }
}
