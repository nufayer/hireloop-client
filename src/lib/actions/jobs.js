export async function createJob(payload) {
  // Client-side wrapper that posts to the internal API route.
  const res = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create job failed: ${res.status} ${text}`);
  }

  return res.json();
}
