import { useCallback, useMemo } from "react";
import { useHistory } from "react-router";
import useFeedback from "../useFeedback";

export default function useApi(apiObject) {
  const { showError } = useFeedback()
  const history = useHistory()

  const fetch = useCallback((method, dataToManipulate) => {
    return new Promise ((resolve, reject) => {
      apiObject.refreshToken()
        .then(isLogged => {
          if (isLogged) {
            apiObject[method](dataToManipulate).then(resolve).catch(reject)
          }
        })
        .catch(err => {
          history.push('/login')
        }) 
    })
  }, [apiObject, history])


  const api = useMemo(() => (
    {
      fetch
    }
  ), [fetch])

  return api
}