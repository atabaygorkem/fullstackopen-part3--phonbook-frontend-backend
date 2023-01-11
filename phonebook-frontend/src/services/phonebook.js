import axios from "axios"

const baseUrl = "/api/persons" //"http://localhost:3001/api/persons"

function getAll() {
  return axios.get(baseUrl).then((response) => response.data)
}

function create(newObject) {
  return axios.post(baseUrl, newObject).then((response) => response.data)
}

function update(id, newObject) {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data)
}

function deletePhone(id) {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data)
}

export default { getAll, create, update, deletePhone }
