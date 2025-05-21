const getRiwayatAnak = async (anakId, token) => {
  try {
    const response = await fetch(`https://your-api-url.com/api/riwayat/${anakId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data riwayat');
    }

    const data = await response.json();
    return data.data || []; // tergantung struktur response API kamu
  } catch (error) {
    console.error('Error mengambil riwayat anak:', error);
    return [];
  }
};

export default getRiwayatAnak;
