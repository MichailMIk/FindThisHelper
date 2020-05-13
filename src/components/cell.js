import React from "react"
import s from './cell.module.css'

const Cell = (props) => {
    let cell = props.cell

    let clas = s.isUnknown
    if (cell.isBusy) clas = s.isBusy
    else if (cell.isEmpty) clas = s.isEmpty
    // else if (cell.isGoal) clas = s.isGoal

    // {cell.nNeibGiven + '(' +
    // cell.nNeibUnknown + ' ' +
    // cell.nNeibBusy + ' ' +
    // cell.nNeibEmpty + ')'
    // }
    let nGiven = cell.nNeibGiven
    if (nGiven === undefined) {nGiven = '?'}

    return (
        <button className={clas} id={cell.index} onClick={cell.onClick}>
            {nGiven}
        </button>
    )
}
export default Cell

