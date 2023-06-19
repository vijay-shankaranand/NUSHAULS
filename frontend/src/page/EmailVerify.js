import React, { useState , useEffect, Fragment} from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"


const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
	const param = useParams();

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const url = `${process.env.REACT_APP_SERVER_DOMIN}/${param.id}/verify/${param.token}`;
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
				<div className="p-80 wd-40 flex items-center h-full justify-center items-center">
					<p>Email verified successfully!</p>
					<Link to="/login">
							<button className="rounded bg-amber-500 hover:bg-blue-800">Login</button>
					</Link>

				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</Fragment>
  )
}

export default EmailVerify