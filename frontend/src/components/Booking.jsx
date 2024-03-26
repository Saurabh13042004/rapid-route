import React, { useEffect, useState } from "react";
import { RiSearchLine, RiTaxiLine } from "react-icons/ri";
import { useBookingContext } from "../context/BookingContext";
import { SiSourcehut } from "react-icons/si";
import { LuChevronLast } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { BiLoaderAlt } from "react-icons/bi";
import Loader from "../components/Loader";
import RecentBooking from "../components/RecentBooking";
import Cabs from "./Cabs";
import toast, { Toaster } from "react-hot-toast";

function Bookings() {
  const {
    formData,
    previousBookings,
    loading,
    error,
    availableCabs,
    selectedCab,
    allCabs,
    handleChange,
    handleCheckAvailableCabs,
    handleCabSelection,
    handleCreateBooking,
  } = useBookingContext();

  const alphabetOptions = ["A", "B", "C", "D", "E", "F"];
  return (
    <>
      <div className="max-w-6xl mx-auto p-4 bg-white rounded-md shadow-md block mb-8">
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <SiSourcehut className="text-gray-400" />
            <select
              className="flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leaving from"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="">Leaving from</option>
              {alphabetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <LuChevronLast className="text-gray-400" />
            <select
              className="flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Going to"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
            >
              <option value="">Going to</option>
              {alphabetOptions
                .filter((option) => option !== formData.source) // Filter out selected source
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <CiCalendarDate className="text-gray-400" />
            <input
              className="flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Date"
              type="date"
              name="date"
              value={formData.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <IoTimeOutline className="text-gray-400" />
            <input
              className="flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Start time"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-gray-400" />
            <input
              className="flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <MdOutlineEmail className="text-gray-400" />
            <input
              className="flex-1 h-10 rounded-md border px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <button
            type="button"
            className="col-span-full sm:col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center h-10 rounded-md bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleCheckAvailableCabs}
          >
            <RiSearchLine className="w-4 h-4 mr-1" />
            Search
          </button>
        </form>

        {loading && <Loader />}
        {availableCabs.length > 0 && (
          <div className="mt-4">
            <select
              value={selectedCab}
              onChange={(e) => handleCabSelection(e.target.value)}
              className="input input-bordered mb-4"
            >
              <option value="">Select a Cab</option>
              {availableCabs.map((cab) => (
                <option key={cab._id} value={cab._id}>
                  {cab.name} - Rs. {cab.rate}
                </option>
              ))}
            </select>
            {selectedCab && (
              <div className="flex justify-end mt-2">
                <button
                  className="btn btn-primary flex items-center"
                  type="button"
                  onClick={() => {
                    handleCreateBooking();
                  }}
                >
                  <RiTaxiLine className="w-5 h-5 mr-2" />
                  {loading ? <><BiLoaderAlt className="animate-spin" /> Booking in progress ...</> : "Book Now"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

     
      <div className="max-w-6xl mx-auto p-4 bg-white rounded-md shadow-md block mb-8">
        
        <div className="flex items-center mb-4">
          <RiSearchLine className="w-6 h-6 mr-2" />
          <h2 className="text-lg font-bold">Previous Bookings</h2>
        </div>
       
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {
           previousBookings.map((booking, index) => (
              <RecentBooking key={index} booking={booking} />
            ))
          }
        </div>
      </div>

      {/* All cabs */}
      <div className="max-w-6xl mx-auto p-4 bg-white rounded-md shadow-md block mb-8">
        {/* All cabs title */}
        <div className="flex items-center mb-4">
          <RiSearchLine className="w-6 h-6 mr-2" />
          <h2 className="text-lg font-bold">All Cabs</h2>
        </div>
        {/* All cabs list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          { 
            allCabs.map((cab, index) => <Cabs key={index} cab={cab} />)
          }
        </div>
      </div>
    </>
  );
}

export default Bookings;