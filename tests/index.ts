export * from './vector/index.js';
import {vecTests} from './vector/index.js';

export * from './KVStore/index.js';
import {kvsTests} from './KVStore/index.js';

export function runTests() {
  vecTests.runVectorTests();
  kvsTests.runKvsTests();
}