import { useDispatch, useSelector } from "react-redux";
import { Table } from "../../components/Table";
import { HashLoader } from "react-spinners";
import { useEffect } from "react";
import { fetchBookings } from "../../features/bookings/bookingThunks";
import { getBookingsData, getBookingsStatus } from "../../features/bookings/bookingsSlice";
import { Wrapper } from "../../components/LayoutStyled";
import { getRoomsData, getRoomsStatus } from "../../features/rooms/roomsSlice";
import { fetchRooms } from "../../features/rooms/roomsThunks";


export const Bookings = (props) => {
  const dispatch = useDispatch();
  const bookingsStatus = useSelector(getBookingsStatus);
  const bookingsData = useSelector(getBookingsData);
  const roomsData = useSelector(getRoomsData);
  const roomsStatus = useSelector(getRoomsStatus);
  const tableTitles = [
    "Guest",
    "Order Date",
    "Check In",
    "Check Out",
    "Request",
    "Room Type",
    "Status",
    "Details",
    "Delete",
  ];


  useEffect(() => {
    if (bookingsStatus === "idle") {
      dispatch(fetchBookings());
   
    }
  }, [dispatch, bookingsStatus]);

  useEffect(() => {
    if (roomsStatus === "idle") {
      dispatch(fetchRooms());
    }
  }, [dispatch, roomsStatus]);


  
  if (bookingsData === "pending" || roomsStatus=== "pending") {
    return (
      <>
        <Wrapper>
          <HashLoader color="#799283" size={100} />
        </Wrapper>
      </>
    );
  } else {
    return (
      <>
        <Table tableTitles={tableTitles} data={bookingsData} rooms={roomsData} page={"bookings"} />
      </>
    );
  }

};



    
      