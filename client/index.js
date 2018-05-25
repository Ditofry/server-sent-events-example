const evtSource = new window.EventSource('/eventstream')

evtSource.addEventListener('message', event => {
  const data = JSON.parse(event.data)

  console.log('wat?', event.data)
  window.alert('here be the data', data)
})

document
  .getElementById('send')
  .addEventListener('click', function () {
    const payload = {
      queue: document.getElementById('que-size').value,
      queueId: Date.now()
    }

    window.fetch('/message', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => console.log('the response was', res))
      .catch(err => console.log('the errrrrrr', err))
  })
