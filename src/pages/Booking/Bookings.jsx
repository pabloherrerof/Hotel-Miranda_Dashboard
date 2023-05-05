import { useDispatch, useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { fetchBookings } from "../../features/bookings/bookingThunks";
import { getBookingsData, getBookingsStatus } from "../../features/bookings/bookingsSlice";
import { Wrapper } from "../../components/LayoutStyled";
import { AiOutlineInfoCircle, AiOutlineSearch } from "react-icons/ai";
import { VscTrash } from "react-icons/vsc";
import {
  CustomDropdown,
  LeftActions,
  RightActions,
  SearchBar,
  StyledLink,
  TableActions,
  TableContainer,
  TableItem,
  TableLink,
  TableRow,
  TableTitle,
} from "../../components/TableStyled";
import { Button, NotesButton, StatusButton } from "../../components/Button";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { Modal } from "../../components/Modal";
import { bookedStatusCalc, dateConverter } from "../../features/otherFunctions";
import { searchBookingRoom } from "../../features/API";


export const Bookings = (props) => {
  const dispatch = useDispatch();
  const bookingsStatus = useSelector(getBookingsStatus);
  const bookingsData = useSelector(getBookingsData);

  const [showAll, setShowAll] = useState("true");
  const [showCheckIn, setShowCheckIn] = useState("false");
  const [showCheckOut, setShowCheckOut] = useState("false");
  const [showInProgress, setShowInProgress] = useState("false");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetId, setTargetId] = useState("");
  const [tableData, setTableData] = useState(bookingsData);
 
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

  const options = ["Guest", "Order", "Check in", "Check out"];


  useEffect(() => {
    if (bookingsStatus === "idle") {
      dispatch(fetchBookings());
    }
    setTableData(bookingsData);
  }, [dispatch, bookingsStatus, bookingsData]);

  const onClickHandler = (e) => {
    const option = e.target.innerText;
    if (option === "All Bookings") {
      setShowAll("true");
      setShowCheckIn("false");
      setShowCheckOut("false");
      setShowInProgress("false")
      setTableData(bookingsData);
    } else if (option === "Checking In") {
      setShowAll("false");
      setShowCheckIn("true");
      setShowCheckOut("false");
      setShowInProgress("false");
      setTableData(bookingsData.filter((booking) => bookedStatusCalc(booking.checkIn, booking.checkOut) === "CHECK IN"));
    } else if (option === "Checking Out") {
      setShowAll("false");
      setShowCheckIn("false");
      setShowCheckOut("true");
      setShowInProgress("false");
      setTableData(bookingsData.filter((booking) => bookedStatusCalc(booking.checkIn, booking.checkOut) === "CHECK OUT"));
    } else if (option === "In Progress"){
      setShowAll("false");
      setShowCheckIn("false");
      setShowCheckOut("false");
      setShowInProgress("true");
      setTableData(bookingsData.filter((booking) => bookedStatusCalc(booking.checkIn, booking.checkOut) === "IN PROGRESS"));
    }
  };

  const onSearchInputHandler = (e) => {
    console.log(e.target.value);
    setTableData(
      tableData.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    if (e.target.value === "") {
      if (showAll === "true") {
        setTableData(bookingsData);
      }
      if (showCheckIn === "true") {
        setTableData(bookingsData.filter((booking) => bookedStatusCalc(booking.checkIn, booking.checkOut) === "CHECK IN"));
      }
      if (showCheckOut === "true") {
        setTableData(bookingsData.filter((booking) => bookedStatusCalc(booking.checkIn, booking.checkOut) === "CHECK OUT"));
      }
      if(showInProgress === "true"){
        setTableData(bookingsData.filter((booking) => bookedStatusCalc(booking.checkIn, booking.checkOut) === "IN PROGRESS"));
      }
    }
  };

  const onChangeHandler = (e) => {
    if (e.value === "Guest") {
      setTableData(
        [...tableData].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name < b.name) return 1;
          return 0;
        })
      );
    }
    if (e.value === "Order") {
      setTableData(
        [...tableData].sort((a, b) => {
          if (a.orderDate < b.orderDate) return -1;
          if (a.orderDate < b.orderDate) return 1;
          return 0;
        })
      );
    }
    if (e.value === "Check in") {
      setTableData(
        [...tableData].sort((a, b) => {
          if (a.checkIn < b.checkIn) return -1;
          if (a.checkIn < b.checkIn) return 1;
          return 0;
        })
      );
    }
    if (e.value === "Check out") {
      setTableData(
        [...tableData].sort((a, b) => {
          if (a.checkOut < b.checkOut) return -1;
          if (a.checkOut < b.checkOut) return 1;
          return 0;
        })
      );
    }
  };
  
  
  if (bookingsStatus === "pending" || bookingsStatus === "idle") {
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
        <TableActions>
          <LeftActions>
            <TableLink active={showAll} onClick={onClickHandler}>
              All Bookings
            </TableLink>
            <TableLink active={showCheckIn} onClick={onClickHandler}>
              Checking In
            </TableLink>
            <TableLink active={showCheckOut} onClick={onClickHandler}>
              Checking Out
            </TableLink>
            <TableLink active={showInProgress} onClick={onClickHandler}>
              In Progress
            </TableLink>
          </LeftActions>
          <RightActions>
            <SearchBar>
              <AiOutlineSearch />
              <input
                type="text"
                name="users"
                id="users"
                onChange={onSearchInputHandler}
                placeholder="Search By Guestname"
              />
            </SearchBar>
            {showAll === "true" ? (
              <Button
                onClick={() => {
                  setShowCreateModal(true);
                }}
              >
                + New 
              </Button>
            ) : (
              ""
            )}
            <CustomDropdown
              arrowOpen={<MdOutlineKeyboardArrowUp />}
              arrowClosed={<MdOutlineKeyboardArrowDown />}
              options={options}
              onChange={onChangeHandler}
              value={"ID"}
            />
          </RightActions>
        </TableActions>
       
        <TableContainer>
        <thead>
          <TableTitle>
            {tableTitles.map((element) => (
              <th key={tableTitles.indexOf(element)}>{element}</th>
            ))}
          </TableTitle>
        </thead>
        <tbody>
          {tableData.map((element) => (
            <TableRow key={element.id}>
               <TableItem>
              {element.name}
              <p>{element.id}</p>
            </TableItem>
            <TableItem>
              {dateConverter(element.orderDate).date}
              <p>{dateConverter(element.orderDate).hour}</p>
            </TableItem>
            <TableItem>
              {dateConverter(element.checkIn).date}
              <p>{dateConverter(element.checkIn).hour}</p>
            </TableItem>
            <TableItem>
              {dateConverter(element.checkOut).date}
              <p>{dateConverter(element.checkOut).hour}</p>
            </TableItem>
            <TableItem>
              <NotesButton>View Notes</NotesButton>
            </TableItem>
            <TableItem>
              {searchBookingRoom(element.room).roomType} - {searchBookingRoom(element.room).roomNumber}
            </TableItem>
            <TableItem>
              <StatusButton
                status={bookedStatusCalc(element.checkIn, element.checkOut)}
              >
                {bookedStatusCalc(element.checkIn, element.checkOut)}
              </StatusButton>
            </TableItem>
            <TableItem>
              <StyledLink to={`/bookings/${element.id}`}>
                <AiOutlineInfoCircle />
              </StyledLink>
            </TableItem>
            <TableItem>
              <VscTrash
                onClick={() => {
                  setShowDeleteModal(true);
                  setTargetId(element.id);
                }}
              />
            </TableItem>
            </TableRow>
          ))}
        </tbody>
      </TableContainer>
      <Modal
        mode="delete"
        page={"bookings"}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        itemId={targetId}
      />
      <Modal
          mode="create"
          page={"bookings"}
          setShowCreateModal={setShowCreateModal}
          showCreateModal={showCreateModal}
        />
      </>
    );
  }

};



    
      