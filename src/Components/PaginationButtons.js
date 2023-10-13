import "./PaginationButtons.css";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

//Function to create a list of buttons needed according to props value.
const PaginationButtons = ({
  currPageNum,
  numberOfPages,
  handleClick,
  handlePreviousPagesClick,
  handleCurrentPageClick,
  handleLastPageClick,
  handleNextPageClick
}) => {
  const generateButtonList = () => {
    let buttonList = [];
    for (let pageNum = 1; pageNum <= numberOfPages; pageNum++) {
      buttonList.push(
        <button
          key={pageNum}
          onClick={(e) => {handleClick(e.target.innerText);
          }}
          className={currPageNum === pageNum ? "button-current-page" : null}
        >
          {pageNum}
        </button>
      );
    }
    return buttonList;
  }

  return (
    <div className="pagination-button-container">
      <button
        onClick={handleCurrentPageClick}
        className={currPageNum === 1 ? "button-disabled" : null}
      >
        <FirstPageIcon />
      </button>
      <button
        onClick={handlePreviousPagesClick}
        className={currPageNum === 1 ? "button-disabled" : null}
      >
        <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
      </button>
      {generateButtonList()}
      <button
        onClick={handleNextPageClick}
        className={currPageNum === numberOfPages ? "button-disabled" : null
        }
      >
        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
      </button>
      <button
        onClick={handleLastPageClick}
        className={currPageNum === numberOfPages ? "button-disabled" : null
        }
      >
        <LastPageIcon />
      </button>
    </div>
  );
}

export default PaginationButtons;
