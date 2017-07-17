/**
 * @key subjectCollection
 * @key subjectId
 * @key predicate
 * @key objectId
 * @key objectCollection
 */


export const predicateTypes = [
  {
    type: 'DRIVE_MANAGE',
    left: ['account'],
    right: ['drive']
  },
  {
    type: 'DRIVE_NORMAL',
    left: ['account'],
    right: ['drive']
  }
]
