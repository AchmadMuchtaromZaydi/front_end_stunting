const BASE_URL = 'https://backend-stunting.onrender.com';

export async function getAnakList(token) {
  const res = await fetch(`${BASE_URL}/api/status-anak`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Gagal mengambil data anak');
  return result.data;
}

export async function tambahAnak(token, anakData) {
  const res = await fetch(`${BASE_URL}/ml/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(anakData),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Gagal menambahkan data anak');
  return result.data;
}
