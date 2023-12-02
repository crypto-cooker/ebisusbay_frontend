import {onLogout} from "@src/GlobalState/User";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const Clearcookies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onLogout());
  }, []);
}

export default Clearcookies;