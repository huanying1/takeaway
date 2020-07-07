import axios from 'axios'

export default async function ajax(url, data = {}, type = 'GET') {
  try {
    let res = null
    if (type === 'GET') {
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += `${key}=${data[key]}&`
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = `${url}?${dataStr}`
      }
      return {data} = await axios.get(url)
    } else {
      return {data} = await axios.post(url, data)
    }
  } catch (e) {
    throw new Error(e)
  }
}