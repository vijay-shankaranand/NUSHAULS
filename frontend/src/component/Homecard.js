import React from 'react'
import { useEffect } from 'react'

const Homecard = ({name, image, category, price}) => {
  return (
    <div className="p-2">
        <div className='bg-amber-200 shadow-md p-2 rounded cursor-pointer hover:shadow-lg drop-shadow-lg  min-h-[225px] min-w-[100px] max-w-[185px]'>
            <div className="w-40 min-h-[225px] min-w-[100px]">
                <img src={image} className="h-full w-full"/>
            </div>
            <h3 className='font-semibold text-slate-600 text-center capitalize text-lg overflow-hidden'>{name}</h3>
            <p className="text-center font-bold"><span className="text-amber-500">$</span><span>{price}</span></p>
        </div>
    </div>
  )
}

export default Homecard