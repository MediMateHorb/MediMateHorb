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