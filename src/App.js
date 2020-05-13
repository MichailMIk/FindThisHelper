import React from 'react';
import './App.css';
import Cell from "./components/cell";

function App(props) {
    let game = props.game
    let nCol = game.nCol;
    let nRow = game.nRow;
    let rows = [];
    let cols = [];
    for (let j = 0; j < nRow; j++) {
        for (let i = 0; i < nCol; i++) {
            let index = game.getIndex(j, i);
            cols[i] = <Cell cell={game.cells[index]}/>
        }
        rows[j] = <div>{cols.slice()}</div>
    }

    let onChangeRow = (e) => {
        game.onChangeRow (e.target.value)
    }
    let onChangeCol = (e) => {
        game.onChangeCol (e.target.value)
    }
    let onChangeNeib = (e) => {
        game.onChangeNeib (e.target.value)
    }

    return (
        <div className="App">
            <div className='titleZone'>

                <text className='textTitle'>Rows:</text>
                <input className='rowAndCol' value={game.nRowStr} onChange={onChangeRow}></input>

                <text className='textTitle'>Cols:</text>
                <input className='rowAndCol' value={game.nColStr} onChange={onChangeCol}></input>
            </div>
            <div className='titleZone'>
                <text className='neibTitle'>Neighb:</text>
                <input className='neib' maxLength={(game.nColStr+1)*game.nRowStr} value={game.neibStr} onChange={onChangeNeib}></input>
            </div>

            <div className='titleZone'>
                <button onClick = {game.onClickApply.bind(props.game)}>Apply:</button>
            </div>

            {rows}
            <button className="StartHelper" onClick={game.onClickAction.bind(props.game)}>Hint</button>
        </div>
    );
}

export default App;
