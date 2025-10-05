// Helper functions to talk to the API server
const API_BASE = "https://yulagraff.kesug.com/api";

async function postJSON(endpoint, body) {
  const res = await fetch(API_BASE + '/' + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function getJSON(endpoint) {
  const res = await fetch(API_BASE + '/' + endpoint);
  return res.json();
}
