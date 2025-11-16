import axios from "axios";


const API_BASE_URL = 'http://10.255.214.4:3001/api/v1'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

export const fetchUsers = async () =>
  (await api.get("/users")).data;

export const fetchOrders = async () =>
  (await api.get("/orders")).data;

export const fetchOrderById = async (id: string) =>
  (await api.get(`/orders/${id}`)).data;
