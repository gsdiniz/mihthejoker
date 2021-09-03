const CONFIG = { 
  isProduction: process.env.NODE_ENV === 'production' ? true : false,
  baseUrl: window.env && window.env.API ? window.env.API : 'http://localhost:8095/v1'
}

export default CONFIG
