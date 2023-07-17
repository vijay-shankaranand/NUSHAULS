import React from 'react'

export function getSelectedItems() {
  const checkboxes = document.querySelectorAll('input[name="selectedItems"]:checked');
const itemIds = Array.from(checkboxes).map(checkbox => checkbox.value);
return itemIds;
}

const Ordercard = ({image, price, id, user, name, region, timeSlot, timePlaced, residence, deliveryFee, state, timeState, address, studentNumber, number }) => {
  

  return (
    <form>
      <div className="p-2">
        <div className="bg-amber-200 shadow-md p-2 rounded cursor-pointer hover:shadow-lg drop-shadow-lg flex justify-between items-center">
          <div className="h-[220px] w-[200px] border-4">
            <img src={image} className="h-full w-full" alt="loading" />
          </div>
          
          <div className="flex flex-col flex-grow pl-2">
            <h3 className="font-semibold text-slate-600 text-top text-center capitalize text-lg overflow-hidden pb-5">
              {name}
            </h3>
            <div className="flex flex-col mt-2">
              <p className="text-center font-bold">Product location: {address}</p>
              <p className="text-center font-bold">Seller Contact: {number}</p>
              <p className="text-center font-bold">Student Contact: {studentNumber}</p>
              <p className="text-center font-bold">Residence/Hall: {residence}</p>
              {state !== 'Expired' && state !== 'Delivered' && (
                <p className="text-center font-bold">
                  Deliver by: <span className="text-sky-500">{timeSlot}</span>
                </p>
              )}
              {state === 'Available' && (
                <p className="text-center font-bold">
                  Job status: <span className="text-green-500">{state}</span>
                </p>
              )}
              {state === 'Expired' && (
                <p className="text-center font-bold">
                  Job status: <span className="text-red-500">{state}</span>
                </p>
              )}
              {state === 'Accepted' && (
                <p className="text-center font-bold">
                  Job status: <span className="text-violet-500">{state} by you</span>
                </p>
              )}
              {state !== 'Available' && state !== 'Expired' && state !== 'Accepted' && (
                <p className="text-center font-bold">
                  Job status: <span className="text-zinc-500">{state} by you</span>
                </p>
              )}
              
            </div>
          </div>

          <div className="flex flex-col items-end justify-center">
            <p className="text-center font-bold">
              Price: <span className="text-amber-500">$</span>
              <span>{price}</span>
            </p>
            <p className="text-center font-bold">
              Delivery: <span className="text-amber-500">$</span>
              <span>{deliveryFee}</span>
            </p>
          </div>
          <div className="p-10">
          {(state === 'Available' || state === "Accepted") && (
            <div>
              <input className="w-4 h-4" type="checkbox" name="selectedItems" value={id} />
            </div>
          )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Ordercard