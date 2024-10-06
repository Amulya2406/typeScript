import React, { useRef, useState } from "react";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputBar from "../components/InputBar";

const UserPage = () => {
  interface balance {
    expenditure: number;
    category: string;
    date: string;
  }
  const [balanceHistory, setBalanceHistory] = useState<balance[]>([]);
  const [balanceFiltered, setBalanceFiltered] =
    useState<balance[]>(balanceHistory);
  const [income, setIncome] = useState<number>(0);
  const [expenditure, setExpenditure] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [counter, setCounter] = useState(0);
  const [editingIndex, setEditingIndex] = useState<null | number>(null);
  const [sum, setSum] = useState(0);
  const incRef = useRef<HTMLInputElement>(null);

  const notify = (errorToast: string) => {
    toast(errorToast, {
      type: "error" as TypeOptions,
    });
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(Number(e.target.value));
  };

  const inputIncome = (): void => {
    if (incRef.current) {
      incRef.current.value = "";
      setIncome(0);
    }
    if (Number(income) > 0) {
      setCounter(prevCounter => prevCounter + Number(income));
    } else {
      notify("Enter Income");
    }
  };

  const handleExpenditureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenditure(parseFloat(e.target.value));
  };

  const addDataToTable = () => {
    if (!expenditure || isNaN(expenditure)) {
      notify("Enter the expenditure");
      return;
    }
    if (expenditure <= 0) {
      notify("Enter a valid expenditure");
      return;
    }
    if (expenditure > counter) {
      notify("Insufficient balance");
      return;
    }
    if (category === "") {
      notify("Select a category");
      return;
    }

    if (editingIndex != null) {
      const updatedEntry = {
        ...balanceHistory[editingIndex],
        expenditure,
        category,
        date: new Date().toLocaleString(),
      };
      const newHistory = [...balanceHistory];
      newHistory[editingIndex] = updatedEntry;
      setSum(
        prevSum =>
          prevSum - balanceHistory[editingIndex].expenditure + expenditure
      );
      setCounter(
        prevCounter =>
          prevCounter + balanceHistory[editingIndex].expenditure - expenditure
      );
      setBalanceFiltered(newHistory);
      setBalanceHistory(newHistory);
      setEditingIndex(null);
    } else {
      if (counter <= 0) {
        notify("Balance is already 0");
        return;
      }

      const date = new Date().toLocaleString();
      setSum(sum + expenditure);

      setBalanceHistory(prevHistory => [
        ...prevHistory,
        { expenditure, category, date },
      ]);
      setBalanceFiltered(prevHistory => [
        ...prevHistory,
        { expenditure, category, date },
      ]);
      setCounter(prevCounter => prevCounter - expenditure);
    }
    if (incRef.current) {
      incRef.current.value = "";
    }
  };

  const deleteEntry = (index: number) => {
    const toDelete = balanceHistory[index];
    const newArray = [
      ...balanceHistory.slice(0, index),
      ...balanceHistory.slice(index + 1),
    ];
    console.log(newArray);

    setBalanceHistory(newArray);
    setBalanceFiltered(newArray);
    setCounter(prevCounter => prevCounter + toDelete.expenditure);
    setSum(prevSum => prevSum - toDelete.expenditure);
  };

  const handleEditEntry = (index: number) => {
    setEditingIndex(index);
    const entry = balanceHistory[index];
    setExpenditure(entry.expenditure);
    setCategory(entry.category);
  };

  return (
    <div className="divStyle">
      <div>
        <ToastContainer position="top-right" newestOnTop />
      </div>
      <h1>START TRACKING</h1>
      <label>Income</label>
      <InputBar
        type="number"
        ref={incRef}
        value={income}
        placeholder="Enter Amount Earned"
        onChange={handleIncomeChange}
      />
      <button onClick={inputIncome}>Earned</button>
      <br />
      <br />

      <label>Expenditure</label>
      <InputBar
        type="number"
        ref={incRef}
        placeholder="Enter Amount Spent"
        value={expenditure}
        onChange={handleExpenditureChange}
      />

      <br />
      <label>Category</label>
      <select
        name="category"
        id="category"
        value={category}
        onChange={e => {
          setCategory(e.target.value);
        }}
      >
        <option value="">Select</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="HouseRent">HouseRent</option>
        <option value="Medical">Medical</option>
      </select>
      <br />
      <br />
      <button onClick={addDataToTable}>Add to List</button>

      <div>
        <h4>Balance History:</h4>
        <div className="filter">
          <h4>
            Filter:
            <br />
            <label>Date</label>
            <select
              defaultValue={"24"}
              onChange={e => {
                const dateVal =
                  new Date().getHours() - parseInt(e.target.value);
                const fillterdData = balanceHistory.filter(balance => {
                  const time = balance.date.split(",")[1];
                  const hours = time.split(":")[0];
                  console.log("hello");
                  console.log(time, hours);

                  return parseInt(hours) >= dateVal;
                });
                console.log(fillterdData);

                setBalanceFiltered(fillterdData);
              }}
            >
              <option value="24">All</option>
              <option value="3">3Hrs ago</option>
              <option value="5">5Hrs ago</option>
              <option value="8">8Hrs ago</option>
            </select>
            <label>Category</label>
            <select
              name="category"
              id="category"
              onChange={e => {
                const catValue = e.target.value;
                const filterdVAl = balanceHistory.filter(balance => {
                  if (catValue == "All") {
                    return balance;
                  } else if (balance.category == catValue) {
                    return balance;
                  }
                });
                setBalanceFiltered(filterdVAl);
              }}
            >
              <option value="All">All</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="HouseRent">HouseRent</option>
              <option value="Medical">Medical</option>
            </select>
          </h4>
        </div>

        <table className="tables">
          <tbody>
            <tr>
              <th>Index</th>
              <th>Amount Spent</th>
              <th>Category</th>
              <th>Date</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
            {balanceFiltered.length <= 0 ? (
              <div
                className=""
                style={{ fontWeight: "bold", textAlign: "center" }}
              >
                {" "}
                No entries yet
              </div>
            ) : (
              balanceFiltered?.map((balance, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{balance.expenditure}</td>
                  <td>{balance.category}</td>
                  <td>{balance.date}</td>
                  <td>
                    <button onClick={() => deleteEntry(index)}>DELETE</button>
                  </td>
                  <td>
                    <button onClick={() => handleEditEntry(index)}>EDIT</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <h4>Expenditure = {sum}</h4>
      <h2>Balance = {counter}</h2>
    </div>
  );
};

export default UserPage;
