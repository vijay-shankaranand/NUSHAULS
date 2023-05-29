import React, { useState } from "react";
import loginSignupImage from "../asset/login-animation.gif";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";


const LandingPage = () => {
  return (
    <div className="w-full max-w-sm bg-white m-auto flex  flex-col p-4 p-20 md:p-20">Welcome to NUSHAULS!Click the user icon to log in!</div>
  )
}

export default LandingPage