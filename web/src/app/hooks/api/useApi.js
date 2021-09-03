import { useHistory } from "react-router";
import useFeedback from "../useFeedback";

function useApi(apiObject) {
  const { showError } = useFeedback()
  const history = useHistory()

  const fetch = async (method, dataToManipulate) => {
    const isLogged = await apiObject.refreshToken()
    if (isLogged) {
      return apiObject[method](dataToManipulate)
    }
    showError('Faça login novamente')
    history.push('/login')
    return false
  }

  return ({
    fetch
  })
}

export default useApi
