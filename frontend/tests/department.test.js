import test from 'node:test';
import assert from 'node:assert/strict';

const parseDepartmentList = (res) => {
  return Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
};

test('parseDepartmentList parses unwrapped response { success: true, data: [...] }', () => {
  const payload = {
    success: true,
    message: 'Departments retrieved',
    data: [
      { _id: 'dep1', name: 'Cardiology' },
      { _id: 'dep2', name: 'Neurology' },
    ],
  };
  const result = parseDepartmentList(payload);
  assert.equal(result.length, 2);
  assert.equal(result[0].name, 'Cardiology');
  assert.equal(result[1].name, 'Neurology');
});

test('parseDepartmentList parses direct array res [...]', () => {
  const payload = [
    { _id: 'dep1', name: 'General Medicine' },
  ];
  const result = parseDepartmentList(payload);
  assert.equal(result.length, 1);
  assert.equal(result[0].name, 'General Medicine');
});

test('parseDepartmentList handles null, undefined, or unexpected shapes gracefully', () => {
  assert.deepEqual(parseDepartmentList(null), []);
  assert.deepEqual(parseDepartmentList(undefined), []);
  assert.deepEqual(parseDepartmentList({ success: false }), []);
  assert.deepEqual(parseDepartmentList('string'), []);
});
