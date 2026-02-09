import React, { useEffect } from 'react';
import QuestionSheet from './components/QuestionSheet';
import useSheetStore from './store/useSheetStore';

function App() {
  const { fetchSheet } = useSheetStore();

  useEffect(() => {
    fetchSheet('striver-sde-sheet');
  }, [fetchSheet]);

  return (
    <div className="App">
      <QuestionSheet />
    </div>
  );
}

export default App;
