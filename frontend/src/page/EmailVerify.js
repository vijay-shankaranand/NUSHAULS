import React, { useState , useEffect, Fragment} from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";


const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `https://nushauls.onrender.com/api/index/${param.id}/verify/${param.token}`;
				const { data } = await axios.get(url);
				console.log(data);
				setValidUrl(true);
			} catch (error) {
				console.log(error);
				setValidUrl(false);
			}
		};
		verifyEmailUrl();
	}, [param]);
  return (
    <Fragment>
			{validUrl ? (
				<div className="h-screen flex items-center justify-center">
					<h1>Email verified successfully!</h1>
					<Link to="/login">
						<button className="w-full max-w-[150px] m-auto  bg-amber-500 hover:bg-blue-800 cursor-pointer  text-white text-xl font-medium text-center py-1 rounded-full mt-4">
              Login
            </button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</Fragment>
  )
}

export default EmailVerify