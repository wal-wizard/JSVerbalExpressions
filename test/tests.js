import test from 'ava';
import VerEx from '../dist/verbalexpressions';

test('something', (t) => {
    const testRegex = VerEx().something();
    let testString = '';

    t.false(testRegex.test(testString), 'Empty string doesn\'t have something');

    testRegex.lastIndex = 0;
    testString = 'a';
    t.true(testRegex.test(testString), 'a is something');
});

test('anything', (t) => {
    const testRegex = VerEx().startOfLine().anything();
    const testString = 'what';

    t.true(testRegex.test(testString), 'Contains anything');
});

test('anythingBut', (t) => {
    const testRegex = VerEx().startOfLine().anythingBut('w');
    const testString = 'what';

    t.true(testRegex.test(testString), 'Starts with a w');
});

test('somethingBut', (t) => {
    const testRegex = VerEx().somethingBut('a');
    let testString = '';

    t.false(testRegex.test(testString), 'Empty string doesn\'t have something');

    testRegex.lastIndex = 0;
    testString = 'b';
    t.true(testRegex.test(testString), 'Doesn\'t start with an a');

    testRegex.lastIndex = 0;
    testString = 'a';
    t.false(testRegex.test(testString), 'Starts with an a');
});

test('startOfLine', (t) => {
    const testRegex = VerEx().startOfLine().then('a');
    let testString = 'a';

    t.true(testRegex.test(testString), 'Starts with an a');

    testRegex.lastIndex = 0;
    testString = 'ba';
    t.false(testRegex.test(testString), 'Doesn\'t start with an a');
});

test('endOfLine', (t) => {
    const testRegex = VerEx().find('a').endOfLine();
    let testString = 'a';

    t.true(testRegex.test(testString), 'Ends with an a');

    testRegex.lastIndex = 0;
    testString = 'ab';
    t.false(testRegex.test(testString), 'Doesn\'t end with an a');
});

test('maybe', (t) => {
    const testRegex = VerEx().startOfLine().then('a').maybe('b');
    let testString = 'acb';

    t.true(testRegex.test(testString), 'Maybe has a b after an a');

    testRegex.lastIndex = 0;
    testString = 'abc';
    t.true(testRegex.test(testString), 'Maybe has a b after an a');
});

test('anyOf', (t) => {
    const testRegex = VerEx().startOfLine().then('a').anyOf('xyz');
    let testString = 'ay';

    t.true(testRegex.test(testString), 'Has an x, y, or z after an a');

    testRegex.lastIndex = 0;
    testString = 'abc';
    t.false(testRegex.test(testString), 'Doesn\'t have an x, y, or z after an a');
});

test('or', (t) => {
    const testRegex = VerEx().startOfLine().then('abc').or('def');
    let testString = 'defzzz';

    t.true(testRegex.test(testString), 'Starts with an abc or a def');

    testRegex.lastIndex = 0;
    testString = 'xyzabc';
    t.false(testRegex.test(testString), 'Doesn\'t start with an abc or a def');
});

test('lineBreak', (t) => {
    const testRegex = VerEx().startOfLine().then('abc').lineBreak().then('def');
    let testString = 'abc\r\ndef';

    t.true(testRegex.test(testString), 'abc,then a line break and then def');

    testRegex.lastIndex = 0;
    testString = 'abc\ndef';
    t.true(testRegex.test(testString), 'abc, then a line break and then def');

    testRegex.lastIndex = 0;
    testString = 'abc\r\n def';
    t.false(testRegex.test(testString), 'abc, then a line break, then a space and then def');
});

test('br', (t) => {
    const testRegex = VerEx().startOfLine().then('abc').lineBreak().then('def');
    let testString = 'abc\r\ndef';

    t.true(testRegex.test(testString), 'abc, then a line break and then def');

    testRegex.lastIndex = 0;
    testString = 'abc\ndef';
    t.true(testRegex.test(testString), 'abc, then a line break and then def');

    testRegex.lastIndex = 0;
    testString = 'abc\r\n def';
    t.false(testRegex.test(testString), 'abc, then a line break, then a space and then def');
});

test('tab', (t) => {
    const testRegex = VerEx().startOfLine().tab().then('abc');
    let testString = '\tabc';

    t.true(testRegex.test(testString), 'tab then abc');

    testRegex.lastIndex = 0;
    testString = 'abc';
    t.false(testRegex.test(testString), 'No tab then abc');
});

test('withAnyCase', (t) => {
    let testRegex = VerEx().startOfLine().then('a');
    let testString = 'A';

    t.false(testRegex.test(testString), 'Not case-insensitive');

    testRegex = VerEx().startOfLine().then('a').withAnyCase();
    testString = 'A';
    t.true(testRegex.test(testString), 'Case-insensitive');

    testRegex.lastIndex = 0;
    testString = 'a';
    t.true(testRegex.test(testString), 'Case-insensitive');
});

test('whitespace', (t) => {
    const testRegex = VerEx().startOfLine().then('a').whitespace().then('z');
    let testString = 'a z';

    t.true(testRegex.test(testString), 'a, then a space and then z');

    testRegex.lastIndex = 0;
    testString = 'a_z';
    t.false(testRegex.test(testString), 'a, then no whitespace and then z');
});

test('searchOneLine', (t) => {
    let testRegex = VerEx().startOfLine().then('a').br().then('b').endOfLine();
    let testString = 'a\nb';

    t.true(testRegex.test(testString), 'b is on the second line');

    testRegex = VerEx().startOfLine().then('a').br().then('b').endOfLine().searchOneLine();
    testString = 'a\nb';
    t.true(testRegex.test(testString), 'b is on the second line, but we are only searching the first');
});

test('sanitize', (t) => {
    const testRegex = VerEx().startOfLine().then('$a^b\\c|d(e)f[g]h{i}j.k*l+m?').endOfLine();
    const testString = '$a^b\\c|d(e)f[g]h{i}j.k*l+m?';

    t.true(testRegex.test(testString), 'Special character sanitization');
});

test('oneOrMore', (t) => {
    const testRegex = VerEx().startOfLine().then('foo').oneOrMore().endOfLine();
    let testString = 'foo';

    t.true(testRegex.test(testString), 'Contains \'foo\' at least once ');

    testRegex.lastIndex = 0;
    testString = 'foofoo';
    t.true(testRegex.test(testString), 'Contains \'foo\' at least once in \'foofoo\'');

    testRegex.lastIndex = 0;
    testString = 'bar';
    t.false(testRegex.test(testString), 'Contains \'foo\' at least once');
});

test('multiple', (t) => {
    let testRegex = VerEx().startOfLine().multiple('foo').endOfLine();
    let testString = 'foo';

    t.true(testRegex.test(testString), 'Contains \'foo\' at least once');

    testRegex = VerEx().startOfLine().multiple('foo', 2).endOfLine();
    testString = 'foo';
    t.false(testRegex.test(testString), 'Should contain \'foo\' at least twice');

    testRegex = VerEx().startOfLine().multiple('foo', 2).endOfLine();
    testString = 'foofoo';
    t.true(testRegex.test(testString), 'Should contain \'foo\' at least twice');

    testRegex = VerEx().startOfLine().multiple('foo', 2, 5).endOfLine();
    testString = 'foofoofoofoo';
    t.true(testRegex.test(testString), 'Should be \'foo\' repeated two to five times');

    testRegex = VerEx().startOfLine().multiple('foo', 2, 5).endOfLine();
    testString = 'foo';
    t.false(testRegex.test(testString), 'Should be \'foo\' repeated two to five times');
});


test('word', (t) => {
    const testRegex = VerEx().word().endOfLine();
    let testString = 'azertyuiopqsdfghjklmwxcvbn0123456789_';

    t.true(testRegex.test(testString), 'Should match word');

    testString = '. @[]|,&~-';
    for (const char of testString) {
        t.false(testRegex.test(char), `Should not match word (${char})`);
    }
});

test('digit', (t) => {
    const testRegex = VerEx().digit();
    let testString = '0123456789';

    t.true(testRegex.test(testString), 'Should match digit');

    testString = '-.azertyuiopqsdfghjklmwxcvbn @[]|,_&~';
    for (const char of testString) {
        t.false(testRegex.test(char), `Should not match digit (${char})`);
    }
});
