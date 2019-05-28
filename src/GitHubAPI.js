const api = 'https://api.github.com'

export const searchByUsername = (username) => fetch(`${api}/search/users?q=${username}`)
  .then(res => res.json())
  .catch(err => {
    throw err
  })