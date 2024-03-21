/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import toast,{Toaster} from "react-hot-toast";

const BookingContext = createContext();

export const useBookingContext = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    source: "",
    destination: "",
    startTime: "",
    date: "",
  });

  const apiURL = "https://rapid-route.onrender.com";

  const [previousBookings, setPreviousBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableCabs, setAvailableCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState(null);
  const [allCabs, setAllCabs] = useState([]);

  const showToast = (message, type) => {
    toast(message, { duration: 2000, type: type });
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${apiURL}/api/bookings/`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setPreviousBookings(data.bookings);
      setLoading(false);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch bookings", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchAllCabs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      const selectedDate = new Date(value);
      const today = new Date();
      const selectedDateWithoutTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      const todayWithoutTime = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      if (selectedDateWithoutTime < todayWithoutTime) {
        setError("Please select a valid date");
        showToast("Please select a valid date", "error");
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCheckAvailableCabs = async () => {
    if (
      !formData.source ||
      !formData.destination ||
      !formData.startTime ||
      !formData.date ||
      !formData.name ||
      !formData.email
    ) {
      setError("Please fill all the fields");
      showToast("Please fill all the fields", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/bookings/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch available cabs");

      }
      const data = await response.json();
      setAvailableCabs(data.availableCabsWithRates);
    } catch (error) {
      console.error(error);
      setError(error.message);
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCabSelection = (cabId) => {
    setSelectedCab(cabId);
  };

  const handleCreateBooking = async () => {
    if (!selectedCab) {
      setError("Please select a cab");
      showToast("Please select a cab", "error");
      return;
    }
    try {
      const response = await fetch(`${apiURL}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cabId: selectedCab,
        }),
      });
      const responseData = await response.json(); // Parse response JSON

      if (!response.ok) {
        throw new Error(responseData.message); // Throw error message received from server
      }
      availableCabs.length = 0; // Clear available cabs
      fetchBookings(); // Fetch bookings again to update the list
      resetFormFields(); // Reset form fields
      showToast("Booking Created Successfully.", "success");
      showToast("Booking Confirmation is sent to your email.", "success");
    } catch (error) {
      console.error(error);
      setError(error.message);
      showToast(error.message, "error");
    }
  };

  const resetFormFields = () => {
    setFormData({
      name: "",
      email: "",
      source: "",
      destination: "",
      startTime: "",
      date: "",
    });
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const response = await fetch(`${apiURL}/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      const data = await response.json();
      setPreviousBookings((previousBookings) =>
        previousBookings.filter((booking) => booking._id !== bookingId)
      );
      showToast("Booking Deleted Successfully.", "success");
    } catch (error) {
      console.error(error);
      setError(error.message);
      showToast(error.message, "error");
    }
  };

  const fetchAllCabs = async () => {
    try {
      const response = await fetch(`${apiURL}/api/cabs`);
      if (!response.ok) {
        throw new Error("Failed to fetch cabs");
      }
      const data = await response.json();
      setAllCabs(data);
    } catch (error) {
      setError(error.message);
      showToast(error.message, "error");
      console.error(error);
    }
  };

  const handleEditCab = async (editedCab) => {
    try {
      const response = await fetch(`${apiURL}/api/cabs/${editedCab._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCab),
      });



      if (!response.ok) {
        throw new Error("Failed to update cab");
      }

      const updatedCab = await response.json();

      showToast("Cab Updated Successfully.", "success");

      // You can handle the updated cab data as needed, e.g., updating state
      fetchAllCabs();
    } catch (error) {
      console.error(error);
      setError(error.message);
      showToast(error.message, "error");
    }
  };

  return (
    <BookingContext.Provider
      value={{
        formData,
        setFormData,
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
        handleDeleteBooking,
        handleEditCab,
        showToast,
      }}
    >
      <Toaster />
      {children}
    </BookingContext.Provider>
  );
};
