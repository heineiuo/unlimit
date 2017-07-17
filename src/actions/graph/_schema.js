/**
 * @key subjectCollection
 * @key subjectId
 * @key objectId
 * @key objectCollection
 * @key predicate
 * @key predicateData
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
