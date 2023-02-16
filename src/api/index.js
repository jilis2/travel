/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2022-11-16 15:26:46
 * @LastEditors: 
 * @LastEditTime: 2022-11-19 15:39:34
 */
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:1193/api',
  timeout: 30000
})
export default request
