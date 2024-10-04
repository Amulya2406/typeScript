import React, { useState } from 'react';

interface BalanceHistoryItem {
  expenditure: number;
  category: string;
  date: string;
}

const MainPage: React.FC = () => {
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryItem[]>([]);
  const [income, setIncome] = useState<number>(0);
  const [expenditure, setExpenditure] = useState<number | "">("");
  const [category, setCategory] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [sum, setSum] = useState<number>(0);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(parseFloat(e.target.value));
  };

  const handleIncome = () => {
    if (income > 0) {
      setCounter(prevCounter => prevCounter + income);
    } else {
      alert("Income Invalid");
    }
    setIncome(0);
    (document.getElementById("inc") as HTMLInputElement).value = "";
  };

  const handleExpenditureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenditure(parseFloat(e.target.value));
  };

  const handleExpenditure = () => {
    if (!expenditure || isNaN(expenditure)) {
      alert('Enter the expenditure');
      return;
    }

    if (expenditure <= 0) {
      alert('Enter a valid expenditure');
      return;
    }
    if (expenditure > counter) {
      alert("Insufficient balance");
      return;
    }
    if (category === "") {
      alert("Select a category");
      return;
    }

    if (editingIndex !== null) {
      const updatedEntry = { ...balanceHistory[editingIndex], expenditure, category, date: new Date().toLocaleString() };
      const newHistory = [...balanceHistory];
      newHistory[editingIndex] = updatedEntry; 

      setSum(prevSum => prevSum - balanceHistory[editingIndex].expenditure + expenditure);
      setCounter(prevCounter => prevCounter + balanceHistory[editingIndex].expenditure - expenditure);
      setBalanceHistory(newHistory);
      setEditingIndex(null);
    } else {
      if (counter <= 0) {
        alert('Balance is already 0');
        return;
      }

      const date = new Date().toLocaleString();
      setSum(sum + parseFloat(expenditure.toString()));
      setBalanceHistory(prevHistory => [...prevHistory, { expenditure: expenditure as number, category, date }]);
      setCounter(prevCounter => prevCounter - expenditure);
    }

    (document.getElementById("exp") as HTMLInputElement).value = "";
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const sortDate = () => {
    const sortedHistory = [...balanceHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setBalanceHistory(sortedHistory);
  };

  const sortCategory = () => {
    const sortedHistory = [...balanceHistory].sort((a, b) => a.category.localeCompare(b.category));
    setBalanceHistory(sortedHistory);
  };

  const deleteEntry = (index: number) => {
    const toDelete = balanceHistory[index];
    const newArray = [...balanceHistory.slice(0, index), ...balanceHistory.slice(index + 1)];
    setBalanceHistory(newArray);

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
      <h1>START TRACKING</h1>
      <label>Income</label>
      <input
        type="number"
        id="inc"
        placeholder="Enter Amount Earned"
        onChange={handleIncomeChange}
      />
      <button onClick={handleIncome}>Earned</button>
      <br /><br />

      <label>Expenditure</label>
      <input
        type="number"
        id="exp"
        placeholder="Enter Amount Spent"
        value={expenditure}
        onChange={handleExpenditureChange}
      />
      <br />
      <label>Category</label>
      <select name="category" id="category" value={category} onChange={handleCategoryChange}>
        <option value="">Select</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="HouseRent">HouseRent</option>
        <option value="Medical">Medical</option>
      </select>
      <br /><br />
      <button onClick={handleExpenditure}>Add to List</button>

      <div>
        <h4>Balance History:</h4>
        <div className='filter'>
          <h4>Filter:
            <button onClick={sortDate}>DATE</button>
            <button onClick={sortCategory}>CATEGORY</button>
          </h4>
        </div>

        <table className='tables'>
          <tbody>
            <tr>
              <th>Index</th>
              <th>Amount Spent</th>
              <th>Category</th>
              <th>Date</th>
              <th>Delete</th>
              <th>Edit</th>
            </tr>
            {balanceHistory.map((balance, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{balance.expenditure}</td>
                <td>{balance.category}</td>
                <td>{balance.date}</td>
                <td><button onClick={() => deleteEntry(index)}>DELETE</button></td>
                <td><button onClick={() => handleEditEntry(index)}>EDIT</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4>Expenditure = {sum}</h4>
      <h2>Balance = {counter}</h2>
    </div>
  );
};

export default MainPage;
