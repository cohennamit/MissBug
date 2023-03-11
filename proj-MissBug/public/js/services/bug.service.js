import { storageService } from './async-storage.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
}

function query(filterBy = {}) {
  // return storageService.query(STORAGE_KEY)
  // const queryParams = `title=${filterBy?.title || ''}`
  // return axios.get(`/api/bug?${queryParams}`)
  return axios.get(`/api/bug`, { params: filterBy })
    .then(res => res.data)
}

function getById(bugId) {
  // return storageService.get(STORAGE_KEY, bugId)
  return axios.get(`/api/bug/${bugId}`)
    .then(res => res.data)

}

function getEmptyBug() {
  return {
    title: '',
    description: '',
    severity: '',
  }
}

function remove(bugId) {
  // return storageService.remove(STORAGE_KEY, bugId)
  return axios.delete(`/api/bug/${bugId}`)
    .then(res => res.data)
}

function save(bug) {
  if (bug._id) {
    // const queryParams = `title=${bug.title}&description=${bug.description || ''}&severity=${bug.severity}&_id=${bug._id || ''}`
    // return axios.get(`/api/bug/save?${queryParams}`)
    return axios.put(`/api/bug/${bug._id}`, bug)
      .then(res => res.data)
  } else {
    return axios.post(`/api/bug`, bug)
      .then(res => res.data)
  }

}
  // if (bug._id) {
  //   return storageService.put(STORAGE_KEY, bug)
  // }
  // return storageService.post(STORAGE_KEY, bug)
  // }
