import React, { useState , useEffect, Fragment} from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"
import success from '../asset/success.png'


const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
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
		  <div className="flex flex-col min-h-screen justify-center items-center">
			<div>
			  <img src={success} alt="Success" class="object-scale-down "/>
			</div>
			<div className="text-center text-bold text-2xl">
			  <p className="pb-5">Email verified successfully!</p>
					<Link to="/login">
				<button className="rounded bg-amber-500 hover:bg-blue-800 w-20">Login</button>
					</Link>
			</div>
				</div>
			) : (
		  <h1 className="text-center">404 NOT FOUND. You have already verified your email or incorrect URL</h1>
			)}
		</Fragment>
	);
  };

  export default EmailVerify;