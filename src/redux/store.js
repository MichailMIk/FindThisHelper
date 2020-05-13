import React from "react";

let constData = {
    nRow: 6,
    nCol: 5,
    goals: [                //this item for program testing only
        0, 1, 1, 0, 0,
        0, 1, 1, 0, 1,
        1, 0, 1, 0, 1,
        1, 0, 1, 0, 0,
        1, 0, 0, 1, 0,  //25 elemtnts

        0, 1, 1, 0, 0,  //11 elements else
        0, 1, 1, 0, 0, 0
    ],

    neighbhs: [
   //data from game FindThis
   1,2,2,1,1,2,1,1,2,2,1,6,6,5,1,1,1,2,1,2,1,2,1,3,1,1,1,2,2,1,

        1, 2, 2, 1, 1,
        2, 2, 3, 2, 1,
        1, 3, 2, 2, 1,
        2, 2, 1, 2, 1,
        1, 1, 2, 0, 1]
}

let game = {
    nRow: 0,
    nCol: 0,
    cells: [],
    nColStr: '',
    nRowStr: '',


    getNeibStr: function () {
        let str  = ''
        for (let i = 0; i < this.cells.length; i++) {
            let s = this.cells[i].nNeibGiven
            if (s === undefined) {
                if (this.cells[i].isBusy) s = 5
                else  s = 6
            }
            str += s
            if ((i % this.nCol) === (this.nCol-1)) str += ' '
        }
        this.neibStr = str
    },
    rerender: function () {
    },
    onClickAction() {
        let count = 0
        strategy(game, correctNeib) //NB!
        while (count = strategy(this, strategy1)) {
            console.log('--- ', count)
        }
        this.rerender()
    },
    onClickApply () {
        let neib = []
        let str = this.deleteSpace(this.neibStr)
        for (let i = 0; i < str.length; i++) {
            neib.push(Number (str[i]))
        }
        this.initialize({
            nRow: this.nRowStr,
            nCol: this.nColStr,
            neighbhs: neib,
            goals: constData.goals
        })
        this.rerender()
    },
    onChangeRow (body) {
        this.nRowStr = body
        this.rerender()
    },

    onChangeCol (body) {
        this.nColStr = body
        this.rerender()
    },

    deleteSpace (body) {
        let result = ''
        for (let i = 0; i < body.length; i++) {
            if (body[i] !== ' ') result += body[i]
        }
        return result
    },
    insertSapace (body, nCol) {
        let result = ''
        for (let i = 0; i < body.length; i++) {
            result += body[i]
            if (i%nCol === nCol-1) result += ' '
        }
        return result
    },
    onChangeNeib (body) {
        body = this.deleteSpace(body)
        body = this.insertSapace(body, this.nColStr)
        this.neibStr = body
        this.rerender()
    },

    create(rerender) {
        this.rerender = rerender
        this.initialize(constData)
    },

    initialize(data) {
        let nCol = data.nCol
        let nRow = data.nRow
        this.nRow = nRow
        this.nCol = nCol
        this.nCell = nRow * nCol
        this.cells = []
        for (let j = 0; j < nRow; j++) {
            for (let i = 0; i < nCol; i++) {
                let cell = this.createCell(j, i, data.goals, data.neighbhs)
                this.cells.push(cell)
            }
        }
        this.getNeibStr()
        this.nColStr = this.nCol
        this.nRowStr = this.nRow
    },

    createCell(row, col, goals, neighbhs) {
        let nCol = this.nCol
        let nRow = this.nRow

        let index = row * this.nCol + col
        let isGoal = goals[index] ? true : false

        let nNeibGiven = neighbhs[index]

        let nNeibAll = 4

        //calculate nNeibAll
        if (row === 0) {                    //up side
            if (col === 0) {                //1. up left corner
                nNeibAll = 2
            } else if (col === nCol - 1) {  //2. up right corner
                nNeibAll = 2
            } else {                        //3. up side, not corner
                nNeibAll = 3
            }
        } else if (row === nRow - 1) {      //down side
            if (col === 0) {                //4. down left corner
                nNeibAll = 2
            } else if (col === nCol - 1) {  //5. down right corner
                nNeibAll = 2
            } else {                        //6. down side, not corner
                nNeibAll = 3
            }
        } else if (col === 0) {             //7. left side, not corner
            nNeibAll = 3
        } else if (col === nCol - 1) {      //8. right side, not corner
            nNeibAll = 3
        } else {                            //9. inner
            nNeibAll = 4
        }

        let isBusy = false
        let isEmpty = false
        let isUnknown =  true
        if (nNeibGiven === 5) {isBusy = true;  nNeibGiven = undefined; isUnknown =  false}
        else if (nNeibGiven === 6) {isEmpty = true; nNeibGiven = undefined; isUnknown =  false}

        return {
            row: row,
            col: col,
            index: index,       //index of cell in cells array
            isGoal: isGoal,     //is letter in cell

            //const value for cell
            nNeibAll: nNeibAll,         //number of neighbous
            nNeibGiven: nNeibGiven,     //number of letters among neighbous

            //current value for cell
            nNeibUnknown: nNeibAll,
            nNeibBusy: 0,
            nNeibEmpty: 0,

            isBusy: isBusy,
            isEmpty: isEmpty,
            isUnknown: isUnknown,

            onClick: (ev) => {
                let ind = ev.currentTarget.id

                if (ev.ctrlKey) {
                    game.cells[ind].isEmpty = true
                } else {
                    game.cells[ind].isBusy = true
                }

                game.cells[ind].isUnknown = false
                strategy(game, correctNeib)
                game.onClickAction();
            }
        }

    },

    setBusy(cell) {
        cell.isBusy = true
        cell.isUnknown = false
    },

    setEmpty(cell) {
        cell.isEmpty = true
        cell.isUnknown = false
    },

    isBusy(ind) {
        if (ind !== undefined && this.cells[ind].isBusy)
            return 1
        else
            return 0
    },
    isEmpty(ind) {
        if (ind !== undefined && this.cells[ind].isEmpty)
            return 1
        else
            return 0
    },
    getIndex(j, i) {
        if (j < 0 || j >= this.nRow || i < 0 || i >= this.nCol) return undefined

        return j * this.nCol + i;
    }
}

const strategy = (game, strategyForCell) => {
    let count = 0
    for (let i = 0; i < game.nCell; i++) {
        count += strategyForCell(game, i,)
    }
    return count
}

const correctNeib = (game, ind) => {
    let cell = game.cells[ind]
    const row = cell.row
    const col = cell.col
    let neib = undefined

    cell.nNeibBusy = 0
    cell.nNeibEmpty = 0

    //up cell
    neib = game.getIndex(row - 1, col)
    cell.nNeibBusy += game.isBusy(neib)
    cell.nNeibEmpty += game.isEmpty(neib)

    //left cell
    neib = game.getIndex(row, col - 1)
    cell.nNeibBusy += game.isBusy(neib)
    cell.nNeibEmpty += game.isEmpty(neib)

    //down cell
    neib = game.getIndex(row + 1, col)
    cell.nNeibBusy += game.isBusy(neib)
    cell.nNeibEmpty += game.isEmpty(neib)

    //right cell
    neib = game.getIndex(row, col + 1)
    cell.nNeibBusy += game.isBusy(neib)
    cell.nNeibEmpty += game.isEmpty(neib)

    cell.nNeibUnknown = cell.nNeibAll - (cell.nNeibBusy + cell.nNeibEmpty)
}


//strategy1 - стратегия №1 игры:
//Если число смежных ячеек в состоянии "Unknown" равно числу смежных ячеек "с буквами" минус число смежных ячеек в
//состоянии "Busy", то перевести все смежные ячейки из состояния "Unknown" в состояние "Busy".
//число смежных ячеек в состоянии "Unknown" равно числу смежных ячеек "без букв" минус число смежных ячеек в
//состоянии "Empty", то перевести все смежные ячейки из состояния "Unknown" в состояние "Empty".
const strategy1 = (game, ind) => {
    const nNeibUnknown = game.cells[ind].nNeibUnknown
    const nNeibGiven = game.cells[ind].nNeibGiven
    const nNeibBusy = game.cells[ind].nNeibBusy
    const nNeibEmpty = game.cells[ind].nNeibEmpty
    const nNeibAll = game.cells[ind].nNeibAll

    let count = 0
    //Attempt to change all "isUnknown" cells to "isBusy"
    if (nNeibUnknown &&
        nNeibUnknown === nNeibGiven - nNeibBusy) {
        count = setCellState(game, ind, game.setBusy)
    }
    //Attempt to change all "isUnknown" cells to "isEmpty"
    else if (nNeibUnknown &&
             nNeibUnknown === (nNeibAll - nNeibGiven) - nNeibEmpty) {
        count = setCellState(game, ind, game.setEmpty)
    }

    count && strategy(game, correctNeib)    //если были изменения, проводим коррекцию
    return count
}


//setCellState - для всех смежных ячеек, которые еще в неопределенном состоянии (isUnknown), вызывать одну из функций
//изменения состояния на "точно занятый" (isBusy) или "точно не занятый" (isEmplty).
//
const setCellState = (game, ind, stateFunc) => {
    const row = game.cells[ind].row
    const col = game.cells[ind].col
    let neib = undefined

    let count = 0
    //up cell
    neib = game.getIndex(row - 1, col)
    if (neib !== undefined && game.cells[neib].isUnknown) {
        stateFunc(game.cells[neib], game.cells[ind])
        count++
    }
    //left cell
    neib = game.getIndex(row, col - 1)
    if (neib !== undefined && game.cells[neib].isUnknown) {
        stateFunc(game.cells[neib], game.cells[ind])
        count++
    }
    //down cell
    neib = game.getIndex(row + 1, col)
    if (neib !== undefined && game.cells[neib].isUnknown) {
        stateFunc(game.cells[neib], game.cells[ind])
        count++
    }
    //right cell
    neib = game.getIndex(row, col + 1)
    if (neib !== undefined && game.cells[neib].isUnknown) {
        stateFunc(game.cells[neib], game.cells[ind])
        count++
    }
    return count
}

export default game