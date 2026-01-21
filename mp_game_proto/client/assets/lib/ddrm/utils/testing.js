import { Console } from 'node:console';
// Create a new console instance for better object logging
const customConsole = new Console({
    stdout: process.stdout,
    stderr: process.stderr,
    inspectOptions: { depth: null, colors: true }
});
export class Each {
    before;
    after;
    setBefore(fn) {
        this.before = fn;
    }
    setAfter(fn) {
        this.after = fn;
    }
    runBefore() {
        if (this.before) {
            try {
                this.before();
            }
            catch (error) {
                console.error('Error in before hook:', error);
            }
        }
    }
    runAfter() {
        if (this.after) {
            try {
                this.after();
            }
            catch (error) {
                console.error('Error in after hook:', error);
            }
        }
    }
}
export async function runTests(tests, each) {
    const results = [];
    if (!each)
        each = new Each();
    if (!each.before)
        each.setBefore(() => { });
    if (!each.after)
        each.setAfter(() => { });
    console.log('\nRunning tests...');
    for (const test of tests) {
        try {
            console.log(`\n🧪 Testing: ${test.name}`);
            each.runBefore();
            const result = await test.fn();
            each.runAfter();
            results.push({ ...result, name: test.name });
            customConsole.log(`${result.passed ? '✅' : '❌'} ${test.name}`, '\n  Expected:', result.expected, '\n  Got:', result.got);
        }
        catch (error) {
            results.push({
                name: test.name,
                passed: false,
                expected: 'test to complete',
                got: `Error: ${error.message}`
            });
            each.runAfter();
            customConsole.log(`❌ ${test.name} (Error: ${error.message})`);
        }
    }
    const summary = {
        total: results.length,
        passed: results.filter(r => r.passed).length,
        failed: results.filter(r => !r.passed).length
    };
    console.log('\n📊 Test Summary:');
    console.log(`Total: ${summary.total}`);
    console.log(`Passed: ${summary.passed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    if (summary.failed > 0) {
        console.log('\n❌ Failed Tests:');
        results.filter(r => !r.passed).forEach(r => {
            customConsole.log(`- ${r.name}`, '\n  Expected:', r.expected, '\n  Got:', r.got);
        });
    }
    return summary.failed === 0;
}
