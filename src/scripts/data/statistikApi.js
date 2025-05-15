const BASE_URL = 'https://backend-stunting.onrender.com'; // ganti sesuai domainmu

async function getStatistik(token) {
  try {
        const response = await fetch(`${BASE_URL}/api/statistik`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

    if (!response.ok) throw new Error('Gagal ambil data statistik');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error ambil statistik:', error.message);
    return null;
  }
}

export default getStatistik;
