import { getAnakById, deleteAnakById } from "../../data/anakApi.js";

const DetailAnakPresenter = {
  async fetchDetailAnak(token, id) {
    return await getAnakById(token, id);
  },

  async hapusAnak(token, id) {
    return await deleteAnakById(token, id);
  },
};

export default DetailAnakPresenter;
