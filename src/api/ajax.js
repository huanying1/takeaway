import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:4001/'

export default async function ajax(url, data = {}, type = 'GET') {
  try {
    if (type === 'GET') {
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += `${key}=${data[key]}&`
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = `${url}?${dataStr}`
      }
      return  await axios.get(url)
    } else {
      return  await axios.post(url, data)
    }
  } catch (e) {
    throw new Error(e)
  }
}
