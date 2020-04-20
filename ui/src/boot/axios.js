import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
	baseURL: 'http://localhost:6401'
})

Vue.prototype.$axios = axiosInstance

export {axiosInstance}