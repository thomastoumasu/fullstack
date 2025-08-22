import axios from 'axios'
import logger from '../utils/logger'
const baseUrl = 'http://localhost:3003/api/blogs' // can be served by npm run server (json-server) or blogListBackend (mongodb)

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios
    .get(baseUrl)
  logger.info('--blogService: got blogs:', response.data)
  return response.data
}

const create = async newObject => {
  const config = { 
    headers: { Authorization: token } 
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default {
  getAll, setToken, create
} 
