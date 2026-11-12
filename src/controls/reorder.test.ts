import { describe, expect, it } from 'vitest';
import { moveBy, moveOnto } from './reorder';

const ids = ['a', 'b', 'c', 'd'];

describe('moveBy', () => {
  it('moves an item up or down by one place', () => {
    expect(moveBy(ids, 'c', -1)).toEqual(['a', 'c', 'b', 'd']);
    expect(moveBy(ids, 'b', 1)).toEqual(['a', 'c', 'b', 'd']);
  });

  it('stops at the ends of the list', () => {
    expect(moveBy(ids, 'a', -1)).toEqual(ids);
    expect(moveBy(ids, 'd', 1)).toEqual(ids);
  });

  it('returns the same order for an unknown id', () => {
    expect(moveBy(ids, 'z', 1)).toEqual(ids);
  });

  it('does not change the list it was given', () => {
    moveBy(ids, 'a', 2);
    expect(ids).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('moveOnto', () => {
  it('moves an item down into the place of the item it was dropped on', () => {
    expect(moveOnto(ids, 'a', 'c')).toEqual(['b', 'c', 'a', 'd']);
  });

  it('moves an item up into the place of the item it was dropped on', () => {
    expect(moveOnto(ids, 'd', 'b')).toEqual(['a', 'd', 'b', 'c']);
  });

  it('changes nothing when an item is dropped on itself or on something unknown', () => {
    expect(moveOnto(ids, 'b', 'b')).toEqual(ids);
    expect(moveOnto(ids, 'b', 'z')).toEqual(ids);
  });
});
