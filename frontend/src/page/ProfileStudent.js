import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import { toast } from 'react-hot-toast';

const ProfileStudent = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contactNumber, setContactNumber] = useState(userData.number);
  const [hallOfStay, setHallOfStay] = useState(userData.address);

  console.log(userData)

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveChanges = () => {
    if (!/^\d{8}$/.test(contactNumber)) {
      toast.error('Contact number should be 8 digits');
      return;
    }

    // Update the relevant fields in the userData state
    const updatedUserData = {
      ...userData,
      number: contactNumber,
      address: hallOfStay,
    };

    // Dispatch the updateUser action to update the user data in Redux state
    dispatch(updateUser(updatedUserData));
    
    // Send an API request to update the data on the server
    fetch(`${process.env.REACT_APP_SERVER_DOMIN}/updateUser`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: userData._id,
        number: contactNumber,
        address: hallOfStay,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server if needed
        console.log(data);
        toast.success('Profile updated successfully');
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
        toast.error('Failed to update profile');
      });

    // Close the modal
    setIsEditModalOpen(false);
  };

  const handleContactNumberKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div className="m-auto w-full text-center p-10 bg-amber-200">
        <h2 className="text-4xl font-bold">
          My <span className="text-amber-500">Profile</span>
        </h2>
      </div>
      <div className="flex flex-col items-center mt-10">
        <div className="max-w-md bg-white shadow-lg rounded-lg overflow-hidden w-full">
          <div className="flex justify-center">
            <img
              src={userData.image}
              alt="Profile"
              className="w-32 h-32 object-cover mt-4"
            />
          </div>
          <div className="p-6">
            <h3 className="text-3xl font-bold mb-4 text-center">
              {userData.firstName} {userData.lastName}
            </h3>
            <div className="mb-2">
              <p className="text-lg font-semibold">Email:</p>
              <p>{userData.email}</p>
            </div>
            <div className="mb-2">
              <p className="text-lg font-semibold">Role:</p>
              <p>{userData.role}</p>
            </div>
            <div className="mb-2">
              <p className="text-lg font-semibold">Contact Number:</p>
              <p>{userData.number}</p>
            </div>
            <div className="mb-2">
              <p className="text-lg font-semibold">Hall of Stay:</p>
              <p>{userData.address}</p>
            </div>
            <div className="text-right">
              <button
                className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEditClick}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Contact Number:</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value.slice(0, 8))}
                onKeyPress={handleContactNumberKeyPress}
                maxLength={8}
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Hall of Stay:</label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={hallOfStay}
                onChange={(e) => setHallOfStay(e.target.value)}
              >
                <option value="" selected disabled>
                  Please Select
                </option>
                <option value="KEVII">King Edward VII Hall</option>
                <option value="PGPR">Prince George's Park Residence</option>
                <option value="Temasek">Temasek Hall</option>
                <option value="Eusoff">Eusoff Hall</option>
                <option value="Raffles">Raffles Hall</option>
                <option value="Sheares">Sheares Hall</option>
                <option value="KentRidge">Kent Ridge Hall</option>
                <option value="UTR">UTown Residence</option>
                <option value="Tembusu">Tembusu College</option>
                <option value="CAPT">CAPT College</option>
                <option value="Cinnamon">Cinnamon College</option>
                <option value="RC4">RC4 College</option>
              </select>
            </div>
            <div className="text-right">
              <button
                className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                onClick={handleModalClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStudent;
