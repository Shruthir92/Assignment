import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://leaves.speakup.systems/api",
  headers: {
    "x-api-key": "grdcJnsPdRac8aor66yV46ySis5xDKbZ3KNinTqE"
  }
});

export async function getUser(name) {
  try {
    const response = await axiosInstance.get("/users", {
      params: {
        name
      }
    });
    return response.data;
  } catch (error) {
    return false;
  }
}

export async function getLeaves(userId) {
  try {
    const response = await axiosInstance.get("/leaves", {
      params: {
        userId
      }
    });
    return response.data;
  } catch (error) {
    return false;
  }
}

export async function removeLeaves(ids) {
  try {
    const response = await axiosInstance.delete("/leaves", {
      params: {
        ids: ids.toString()
      }
    });
    return response;
  } catch (error) {
    return false;
  }
}

export async function getPublicHolidays() {
  try {
    const response = await axiosInstance.get("/public-holidays");
    return response.data;
  } catch (error) {
    return false;
  }
}

export async function recordLeaves(leaves) {
  try {
    const response = await axiosInstance.post("/leaves", {
      leaves
    });
    return response;
  } catch (error) {
    return false;
  }
}
