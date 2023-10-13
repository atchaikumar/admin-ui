import "./HomePage.css"
import React, {useState, useEffect} from "react"
import Header from "./Header";
import Table from "./Table";
import PaginationButtons from "./PaginationButtons";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Box, CircularProgress, Typography } from "@mui/material";

function HomePage() {
  const [users, setUsers] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [allRowsSelected, setAllRowsSelected] = useState(false);
  const [loading, setLoadingSpinner] = useState(false);
  const [editMode, setEditMode] = useState({
    editStatus: false,
    userId: null,
  });
  const { enqueueSnackbar } = useSnackbar();
  const [cannotFetch, setCannotFetch] = useState(false);
  const [usersSelected, setUsersSelected] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  let totalPages = Math.ceil(users.length / 10); //Total number of pages required for the table.

  //Function which make API call to the endpoint given to get the users data.
  const fetchUsers = async () =>{
    setLoadingSpinner(true);
    let response;
    try {
      response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setLoadingSpinner(false);
    } catch (error) {
      setLoadingSpinner(false);
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
    const resJSON = response.data;
    console.log(resJSON);
    return resJSON;
  }

  //Function to filter name or email or role.
  const getUsersByNameEmailRole = (searchKey) => {
    let filteredUserList = [];
    filteredUserList = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.email.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.role.toLowerCase().includes(searchKey.toLowerCase())
      );
    });
    totalPages = Math.ceil(filteredUserList.length / 10); //Recalculate the total number of pages for pagination.
    return filteredUserList;
  }

  
  //Function to handle check box in each row
  const handleRowsCheckChange = (userId) => {
    let usersSelectedCopy = [...usersSelected];
    if (usersSelected.includes(userId)) {
      usersSelectedCopy = usersSelectedCopy.filter((val) => val !== userId);
    } else {
      usersSelectedCopy.push(userId);
    }
    setUsersSelected(usersSelectedCopy);
  }
  
  //Function to handle check box in header for all users
  const handleMultipleRowCheckChange = () => {
    let usersList = [];
    if (!allRowsSelected) {
      currentPageUserList.forEach((val) => {
        usersList.push(val.id);
      });
      console.log(usersList);
      setUsersSelected(usersList);
      setAllRowsSelected(true);
    } else {
      setUsersSelected(usersList);
      setAllRowsSelected(false);
    }
  }
  
  //This gets invoked when properties are updated by the admin.
  const updateUserData = (e, userId) => {
    let usersCopy = JSON.parse(JSON.stringify(users));
    for (let i = 0; i < usersCopy.length; i++) {
      if (usersCopy[i].id === userId) {
        usersCopy[i][e.target.name] = e.target.value;
      }
    }
    setUsers(usersCopy);
  }
  
  //Function to delete all selected users.
  const deleteUsers = () => {
    let usersCopy = [...users];
    usersCopy = usersCopy.filter((val) => !usersSelected.includes(val.id));
    setUsers(usersCopy);
    setUsersSelected([]);
    setAllRowsSelected(false);
    enqueueSnackbar("Selected users data deleted successfully", { variant: "success" });
  }
  
  //Function for delete button under action column.
  const deleteUser = (userId) => {
    let usersList = [];
    usersList = users.filter((val) => val.id !== userId);
    setUsers(usersList);
    enqueueSnackbar("Deleted user's data successfully", { variant: "success" });
  }
  
  //This function checks the data correctly filled when edit button clicked.
  function userDataValidation(userId) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        if (
          users[i].name === "" ||
          users[i].email === "" ||
          !validateEmail(users[i].email)
        ) {
          if(users[i].name === "")
            alert("Name cannot be empty");
          if(users[i].email === "")
            alert("Email cannot be empty");
          return false;
        }
        break;
      }
    }
    return true;
  }

  //Validates whether mail entered is valid.
  function validateEmail(email) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email.match(mailformat))
      alert("Enter a valid email id. Ex: 'example@xmail.com'");
    return email.match(mailformat);
  }

  //Handler function for previous page number
  const handlePreviousPagesClick = () => {
    if (currentPageNumber > 1) {
      setCurrentPageNumber(currentPageNumber - 1);
    }
  }
  
  //Function which returns the current page users list
  const getCurrentPageUserList = (userList) => {
    let currentPageUserList = [];
    let topUserIndex = (currentPageNumber - 1) * 10;
    let bottomUserIndex =
    topUserIndex + 9 <= userList.length - 1
    ? topUserIndex + 9
    : userList.length - 1;
    currentPageUserList = userList.slice(topUserIndex, bottomUserIndex + 1);
    
    //If the current page users data deleted move to the previous page
    if (currentPageUserList.length === 0 && currentPageNumber !== 1) {
      handlePreviousPagesClick();
    }
    return currentPageUserList;
  }
  
  //Variable containing current page users list
  const currentPageUserList = 
    searchString === "" 
      ? getCurrentPageUserList(users) 
      : getCurrentPageUserList(getUsersByNameEmailRole(searchString));
  //Handler function for Next page number
  const handleNextPageClick = () => {
    if (currentPageNumber < totalPages) {
      setCurrentPageNumber(currentPageNumber + 1);
    }
  }
  
  useEffect(() => {
    console.log("Current page number " + currentPageNumber);
    setUsersSelected([]); //Resets users when page changes
    setAllRowsSelected(false);
  }, [currentPageNumber]);

  useEffect(() => {
    fetchUsers()
      .then((response) => {
        setUsers(response);
        setCannotFetch(false);
      })
      .catch((error) => {
        console.log(error.message);
        setCannotFetch(true);
        enqueueSnackbar("Cannot fetch data at the moment", { variant: "error" });
      });
  }, []);

  if (cannotFetch) {
    return (
      <>
        <Header />
        <div>
          <h5>
            Oops!. Cannot fetch data at the moment. Try refreshing the app or try again after some time.
          </h5>
        </div>
      </>
    );
  }

  return(
    <React.Fragment>
      <Header />
      <Box className="search-bar-container">
            <Box className="search-bar">
                <input
                 type="search"
                 placeholder="Search by name, email or role"
                 value={searchString}
                 onChange={(e) => setSearchString(e.target.value)}
                />
            </Box>
        </Box>
      {loading ? (
        <Box className="loading">
          <CircularProgress />
          <Typography variant="h5">Loading Users</Typography>
        </Box>
        ) : (
          <Table
            users={currentPageUserList}
            usersSelected={usersSelected}
            allRowsSelected={allRowsSelected}
            handleMultipleRowCheckChange={handleMultipleRowCheckChange}
            handleEditButtonClick={(userId) =>
              setEditMode({ editStatus: true, userId })
            }
            handleSaveClick={(userId) => {
              let isUserDataValid = userDataValidation(userId);
              if (isUserDataValid) {
                setEditMode({
                  editStatus: false,
                  userId: null,
                });
              }
              enqueueSnackbar("User data saved successfully", { variant: "success" });
            }}
            editMode={editMode}
            validateEmail={validateEmail}
            handleDeleteButtonClick={(userId) => deleteUser(userId)}
            handleRowsCheckChange={(userId) => handleRowsCheckChange(userId)}
            handleRowValuesChange={(e, userId) => updateUserData(e, userId)}
          />
        )}
        <div className="deleteBtn-pagination-container">
          <button className="delete-selected-btn" onClick={deleteUsers}>
            Delete Selected
          </button>
          <PaginationButtons
            currPageNum={currentPageNumber}
            numberOfPages={totalPages}
            handleClick={(num) => setCurrentPageNumber(Number(num))}
            handlePreviousPagesClick={handlePreviousPagesClick}
            handleCurrentPageClick={() => setCurrentPageNumber(1)}
            handleLastPageClick={() => setCurrentPageNumber(totalPages)}
            handleNextPageClick={handleNextPageClick}
          />
        </div>
    </React.Fragment>
  );
}

export default HomePage;
