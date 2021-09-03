import { useContext } from "react";
import LoadingContext from "./LoadingContext";

const useLoading = () => useContext(LoadingContext);

export default useLoading;