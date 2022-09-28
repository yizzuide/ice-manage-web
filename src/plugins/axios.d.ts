import axios from 'axios'

type Axios = typeof axios

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: Axios
  }
}

export {
  Axios
}