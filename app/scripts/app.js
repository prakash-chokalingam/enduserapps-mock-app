document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on('app.activated', onAppActivate);
      client.events.on("ticket.change", ticketChanged);
    }
  }
};

async function onAppActivate() {
  var textElement = document.getElementById('apptext');
  var getPortal = await client.data.get('portal');
  var getUser = await client.data.get('user');
  showInfo(getPortal.portal, getUser.user);


  function showInfo(portal, user) {
    if (!portal && !user) {
      return null
    }

    textElement.innerHTML = `
      <p>Loaded app in the portal <b>${portal.name}</b></p>
      <p>Hello user <b>${user.name}</b></p>
      <div id="ticket-info"></div>
    `;
  }
}

async function ticketChanged(event) {
  const data = event.helper.getData();
   document.getElementById('ticket-info').innerHTML = `Ticket field changed: <b>${data.name}</b> #old value: <b>${data.oldValue}</b> # new value: <b>${data.newValue}</b>`;
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}
