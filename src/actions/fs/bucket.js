import {GridFSBucket} from 'mongodb'

export const getBucket = (db, driveId) => new GridFSBucket(db, { 
  bucketName: `gatewayfsdrive${driveId}` 
});
