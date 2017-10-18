import toDiffableHtml from 'diffable-html';

module.exports = {
  test(object) {
    return typeof object === 'string' && object.trim()[0] === '<';
  },
  print(val) {
    return toDiffableHtml(val);
  },
};