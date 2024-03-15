import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useBookingContext } from "../context/BookingContext";


function RecentBooking({ booking }) {
  const { handleDeleteBooking } = useBookingContext();
  
  return (
    <div
      key={booking._id}
      className="border border-gray-200 rounded-md p-4 flex flex-col justify-between"
    >
      {/* Booking details */}
      <div>
        <p className="text-sm font-semibold">User Name: {booking.user.name}</p>
        <p className="text-sm font-semibold">Cab Booked : {booking.cab.name}</p>
        <p className="text-sm font-semibold">Source: {booking.source}</p>
        <p className="text-sm font-semibold">Destination: {booking.destination}</p>
        <p className="text-sm font-semibold">Journey Time : {booking.startTime}</p>
        <p className="text-sm font-semibold">Amount: Rs.{booking.amount}</p>
        {/* Add more details as needed */}
      </div>
      {/* Delete icon */}
      <button
        className="text-red-500 hover:text-red-700 mt-2"
        onClick={() => handleDeleteBooking(booking._id)}
      >
        <RiDeleteBin6Line className="w-5 h-5" />
      </button>
    </div>
  );
}

export default RecentBooking;
