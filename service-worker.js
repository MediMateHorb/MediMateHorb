// Push vom Server
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title || "Medikamenten-Erinnerung";
  const options = {
    body: data.body || "Zeit für deine Einnahme!",
    icon: "/img/pill-icon.png",
    badge: "/img/pill-icon.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Push lokal aus der Webseite
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'local-push') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: "/img/pill-icon.png"
    });
  }
});