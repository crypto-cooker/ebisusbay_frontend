import {appConfig} from "@src/Config";
import axios from "axios";

const config = appConfig();
const api = axios.create({
  baseURL: 'http://localhost:4000/api/',
});

export const createListing = async (signature, address, listing) => {
  try {
    const response = await api.post('gasless-listing', listing, {
      params: {
        signature,
        address
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw error;

  }
}

export const updateListing = async (signature, address, listing) => {
  try {
    const response = await api.patch('gasless-listing', listing, {
      params: {
        signature,
        address
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw error;

  }
}

export const cancelListing = async (signature, address, nonce) => {
  try {
    const response = await api.delete('gasless-listing', {
      params: {
        signature,
        address,
        nonce
      }
    });

    return response.data;
  } catch (e) {
    console.log('error', e);
    throw error;

  }
}

