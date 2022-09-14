import { useState } from "react";
import axios from "axios";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, seterrors] = useState(null);
  const doRequest = async (props = {}) => {
    seterrors();
    try {
      const response = await axios[method](
        url,
        {
          ...body,
          ...props,
        },
        {
          withCredentials: true,
          credentials: "include",
        }
      );
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      seterrors(
        <div className="alert alert-danger">
          <h4>Opps...</h4>
          <ul className="my-0">
            {error?.response?.data.errors.map((el) => (
              <li key={el.message}>{el.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return {
    doRequest,
    errors,
  };
};
export default useRequest;
