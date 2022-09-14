import axios from 'axios'

const apiBuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on server
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    })
  }
  // by default browser
  return axios.create({
    baseURL: '',
  })
}
export default apiBuildClient
