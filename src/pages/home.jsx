import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
useEffect(() => {
const fetch = async () => {
const datos = await getUserData(user.uid);
setUserData(datos);
};
if (user) fetch();
}, [user]);