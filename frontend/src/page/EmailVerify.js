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
				<div className="h-screen flex items-center justify-center">
					<h1>Email verified successfully!</h1>

				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</Fragment>
  )
}

export default EmailVerify