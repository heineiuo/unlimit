import Joi from 'joi'
import {ObjectId} from 'mongodb'
import pick from 'lodash/pick'
import pm2 from 'pm2'
import npm from 'npm'
import selfUpdate from './selfUpdate'


/**
 * 查询进程信息
 * @param {*} query 
 */
const querySchema = Joi.object().keys({
  processId: Joi.string().required(),
  driveId: Joi.string()
})
const query = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, querySchema, {allowUnknown: true})
  if (validated.error) return reject(validated.error)
  const {driveId, processId} = validated.value;
  const {getMongodb, getConfig} = getCtx()
  
  try {
    const processdb = (await getMongodb()).collection('process')
    const result = await processdb.findOne({_id: ObjectId(processId)})
    resolve(result)
  } catch(e){
    reject(e)
  }
})


/**
 * 查询任务信息
 * @param {*} query 
 */
const queryTaskSchema = Joi.object().keys({
  
})
const queryTask = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, queryTaskSchema, {allowUnknown: true})
  try {
    const Task = (await getMongodb()).collection('process_task')
    const result = await Task.find({}).toArray()
    resolve({data: result})

  } catch(e){
    reject(e)
  }
})


/**
 * 新建任务
 * @param {*} query 
 */
const insertTaskSchema = Joi.object().keys({
  name: Joi.string().required(),
  version: Joi.string().default('latest'),
  taskType: Joi.string().allow('create', 'upgrade', 'restart').required(),
  taskConfig: Joi.string()
})
const insertTask = (query) => (dispatch, getCtx) => new Promise(async (resolve, reject) => {
  const validated = Joi.validate(query, insertSchema, {allowUnknown: true})
  if (validated.error) return reject(validated.error)
  try {
    const Process = (await getMongodb()).collection('process')
    if (await Process.findOne({name: validated.name}) !== null) return reject(new Error('PROCESS_EXIST'));
    const processId = (await Process.insert(validated)).ops[0]._id.toString();
    resolve({...validated, processId})
  } catch(e) {
    reject(e)
  }
})

export default {
  selfUpdate,
  query,
  task: {
    query: queryTask,
    insert: insertTask,
  }
}
