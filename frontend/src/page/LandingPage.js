import React, { useState } from "react";
import loginSignupImage from "../asset/login-animation.gif";
import USERSImage from "../asset/STUDENT.png";
import DELIVERYPARTNERSImage from "../asset/DELIVERYPARTNER.png";
import SELLERSImage from "../asset/SELLER.png";
import { BiShow, BiHide } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { BsEmojiSmileUpsideDown } from "react-icons/bs";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import { toast } from "react-hot-toast";


const LandingPage = () => {
  return (
    <div className="bg-amber-200">
    <section class="py-20">
      <div class="sm:w-3/4 lg:w-5/12 mx-auto px-2">
        <h1 class="text-3xl text-center text-bookmark-red ">Overview</h1>
        <p class="text-center text-bookmark-grey mt-4">
           Our main aim is to collate supply orders such as food, essentials and groceries for the residents of NUS. These residents would be the students staying
           in halls and residential colleges. The delivery partner will directly deliver to to the student's place of stay.
        </p>
      </div>

      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-screen-lg mt-18 pt-20 items-center w-screen mx-auto">
        <div className="flex flex-col rounded-md shadow-md h-[530px]">
        <div class="pl-6 pr-6 flex flex-col items-center">
          <div className="h-[300px] w-[300px]">
            <img src={USERSImage} alt="" />
            </div>
            <h3 class="mt-5 mb-2 text-bookmark-blue text-lg">STUDENTS</h3>
            <p class="mb-2 text-bookmark-grey font-light">As residents of the NUS community, you can place your orders through this website.</p>
          </div>
          
          <div class="flex p-6">
          </div>
        </div>
        <div className="flex flex-col rounded-md shadow-md h-[530px]">
        <div class="pl-6 pr-6 flex flex-col items-center">
        <div className="h-[300px] w-[300px] pr-3">
            <img src={DELIVERYPARTNERSImage} alt="" />
            </div>
            <h3 class="mt-5 mb-2 text-bookmark-blue text-lg">DELIVERY PARTNERS</h3>
            <p class="mb-2 text-bookmark-grey font-light">You can accept the orders based on the distance of where the orders have to be collected and the delivery fees of the order. </p>
          </div>
          
          <div class="flex p-6">
          </div>
        </div>
        <div className="flex flex-col rounded-md shadow-md h-[530px]">
        <div class="pl-6 pr-6 flex flex-col items-center">
        <div className="h-[300px] w-[300px]">
            <img src={SELLERSImage} alt="" />
            </div>
            <h3 class="mt-5 mb-2 text-bookmark-blue text-lg">SELLERS</h3>
            <p class="mb-2 text-bookmark-grey font-light">You can display your products for sale, which will only be available to the residents of NUS.</p>
          </div>
          
          <div class="flex p-6">
          </div>
        </div>
        </div>

    </section>
    </div>
    

  )
}

export default LandingPage

    
  
  







