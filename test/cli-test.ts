import {spawn, spawnSync} from 'child_process';

describe('CLI', () => {
  it('reads multiple sources and generates sentences', () => {
    const result = spawnSync('node', [
      'cli.js', '--sentences=2', 'test/fixtures/somewhere-rainbow.txt',
      'test/fixtures/quick-brown-fox.txt'
    ]);
    console.log(`${result.output.join('\n').toString()}`);
  });
});
