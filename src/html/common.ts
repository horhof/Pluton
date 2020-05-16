export const template = `
  const getId =
    id => document.getElementById(id)

  const getValue =
    id => document.getElementById(id).value

  const getRadio =
    name => {
      let value
      const radios = document.getElementsByName(name)
      for (const radio of radios) {
        if (radio.checked) {
          value = radio.value
          break
        }
      }
      return value
    }

  const makeUrl =
    (url, props) => {
      // console.log('Url=%o', url)
      // console.log('props=%o', props)
      url += '?rid=' + Date.now()
      for (const p in props) {
        let v = String(props[p])
        v = v.replace(' ', '%20')
        // console.log('makeUrl> Prop=%o Val=%o', p, v)
        url += '&' + p + '=' + v
      }
      return url
    }
`
