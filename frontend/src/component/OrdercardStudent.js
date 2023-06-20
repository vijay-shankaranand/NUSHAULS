import React from 'react'

const Ordercard = ({image, price, id, user, name, region, timeSlot, timePlaced, residence, deliveryFee, state, timeState}) => {
  

  return (
    <form>
    <div className="p-2">
        <div className='bg-amber-200 shadow-md p-2 rounded cursor-pointer hover:shadow-lg drop-shadow-lg flex justify-evenly'>
            <div className="h-[220px] w-[200px] border-4">
                <img src={image} className="h-full w-full" alt='loading'/>
            </div>

            <div className="flex flex-col align-center justify-between">
              <h3 className='font-semibold text-slate-600 text-center capitalize text-lg overflow-hidden'>{name}</h3>
              <div className= "flex flex-col">
              <p className="text-center font-bold">Product location: {region}</p>
              <p className="text-center font-bold">Residence/Hall: {residence}</p>
              {(state !== "Expired" && state !== "Delivered") ?
              <p className="text-center font-bold">Deliver by: <span className="text-sky-500">{timeSlot}</span></p> :
              <p></p>
              }
              { (state === "Available") ?
              <p className="text-center font-bold">Order status: <span className="text-green-500">{state}</span></p> :
                (state === "Expired") ?
              <p className="text-center font-bold">Order status: <span className="text-red-500">{state}</span></p> :
                (state === "Accepted") ?
                <p className="text-center font-bold">Order status: <span className="text-violet-500">{state}</span></p> :
                <p className="text-center font-bold">Order status: <span className="text-zinc-500">{state}</span></p>
              }
              </div>
              </div>
            <div className="flex flex-col items-end justify-center">
            <p className="text-center font-bold">Price: <span className="text-amber-500">$</span><span>{price}</span></p>
            <p className="text-center font-bold">Delivery: <span className="text-amber-500">$</span><span>{deliveryFee}</span></p>
            </div>

        </div>
    </div>
    </form>
  )
}

export default Ordercard