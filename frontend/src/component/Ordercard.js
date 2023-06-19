import React from 'react'
import { useEffect } from 'react'
import { Link } from "react-router-dom";

const Ordercard = ({name, image, category, price, id}) => {
  return (
    <div className="p-2">
      <Link to={`/order/${id}`} onClick={()=>window.scrollTo({top:"0",behavior : "smooth"})} >
        <div className='bg-amber-200 shadow-md p-2 rounded cursor-pointer hover:shadow-lg drop-shadow-lg  h-[290px] w-[218px]'>
            <div className="w-40 h-[220px] w-[200px]">
                <img src={image} className="h-full w-full" alt='loading'/>
            </div>
            <h3 className='font-semibold text-slate-600 text-center capitalize text-lg overflow-hidden'>{name}</h3>
            <p className="text-center font-bold"><span className="text-amber-500">$</span><span>{price}</span></p>
        </div>
        </Link>
    </div>
  )
}

export default Ordercard