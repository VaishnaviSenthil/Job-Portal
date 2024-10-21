
import axios from 'axios';

const fetchCitiesState= async (code) => {
  const apiKey = "WVZhV1Azbzg3d3hLeUpUc0lBaVFJbjRHNHJwU29PNk1sQzVSeWk2Sw==";
  
  const config = {
    method: 'get',
    url: `https://api.countrystatecity.in/v1/countries/IN/states/${code}/cities`,
    headers: {
      'X-CSCAPI-KEY': apiKey
    }
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error fetching India states', error);
    throw new Error('Failed to fetch India states');
  }
};

export default fetchCitiesState;
