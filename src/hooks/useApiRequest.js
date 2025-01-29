import { useState } from 'react';
import axios from 'axios';
const API_ENDPOINT = "http://3.129.21.231";

const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState(null);

  const makeApiRequest = async (data, isTutorial) => {
    setIsLoading(true);
    setError(null);
    let responseData = null;
    
    if (isTutorial) {
      data = JSON.stringify(data);
      try {
    //     let config = {
    //       method: 'post',
    //       maxBodyLength: Infinity,
    //       url: `${API_ENDPOINT}/generate_module`,
    //       headers: { 
    //         'Content-Type': 'application/json'
    //       },
    //       data: data
    //     };
        
    //     // Use await here to wait for the response
    //     const response = await axios.request(config);
    //     console.log(response)
    //     responseData = response.data;
    //     console.log(responseData)
    //   } catch (err) {
    //     console.error('Error making API request:', err);
    //     setError('An error occurred while making the API request.');
    //   } finally {
    //     setIsLoading(false);
    //     setIsGenerated(true);
    //   }
    // }

    let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${API_ENDPOINT}/generate_module`,
          headers: { 
            'Content-Type': 'application/json'
          },
          data: data
        };
        
        // Use await here to wait for the response
        const response = await axios.request(config);
        responseData = response.data.url;
      } catch (err) {
        console.error('Error making API request:', err);
        setError('An error occurred while making the API request.');
      } finally {
        setIsLoading(false);
        setIsGenerated(true);
      }
    }
  
    return responseData;
  };  

  return { isLoading, isGenerated, error, makeApiRequest };
};

export default useApiRequest;
