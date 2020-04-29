import Vue from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
	// baseURL: 'http://10.1.22.188:6401'
})

Vue.prototype.$axios = axiosInstance

export {axiosInstance}