//Visualization Settings

let width = 1800
let height = 900
let nEdge = 4
let fps = 240
let padding = 50

//Create SVG

let svg = d3.select('#viz').append('svg').attr("width",width).attr("height",height)

//Create Visualization Elements

//Info

let title = svg.append("text").text(`Reducing Search Spaces: ${nEdge}-Queens`)
                            .attr("y",20)
                            .attr("x",width/2)
                            .attr("fill","rgb(0,0,0)")
                            .attr("opacity",1)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","hanging")
                            .attr("font-family","monospace")

//Buttons

let queensUpButton = svg.append("rect")
                            .attr("y",100+width/4)
                            .attr("x",width/2-205)
                            .attr("rx",5)
                            .attr("height",50)
                            .attr("width",200)
                            .attr("fill","rgba(200,200,200,1)")
                            .attr("stroke","rgba(50,50,50,1)")                            
                            .style("cursor", "pointer")   
                            .on("click",incrementQueens)

let queensUp = svg.append("text").text("Queens+1")
                            .attr("y",126+width/4)
                            .attr("x",width/2-105)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")
                            .attr("font-family","monospace")
                            .style("cursor", "pointer")   
                            .on("click",incrementQueens)

let queensDownButton = svg.append("rect")
                            .attr("y",100+width/4)
                            .attr("x",width/2+5)
                            .attr("rx",5)
                            .attr("height",50)
                            .attr("width",200)
                            .attr("fill","rgba(200,200,200,1)")
                            .attr("stroke","rgba(50,50,50,1)")                            
                            .on("click",decrementQueens)
                            .style("cursor", "pointer")   

let queensDown = svg.append("text").text("Queens-1")
                            .attr("y",126+width/4)
                            .attr("x",width/2+105)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")
                            .attr("font-family","monospace")
                            .on("click",decrementQueens)
                            .style("cursor", "pointer")   

let playPauseButton = svg.append("rect")
                            .attr("y",160+width/4)
                            .attr("x",width/2-100)
                            .attr("rx",5)
                            .attr("height",50)
                            .attr("width",200)
                            .attr("fill","rgba(200,255,200,1)")
                            .attr("stroke","rgba(50,50,50,1)")                            
                            .on("click",decrementQueens)
                            .style("cursor", "pointer")  

let playPause = svg.append("text").text("Play/Pause")
                            .attr("y",187+width/4)
                            .attr("x",width/2)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")
                            .attr("font-family","monospace")
                            .on("click",play)
                            .style("cursor", "pointer")  

let resetButton = svg.append("rect")
                            .attr("y",220+width/4)
                            .attr("x",width/2-100)
                            .attr("rx",5)
                            .attr("height",50)
                            .attr("width",200)
                            .attr("fill","rgba(255,200,200,1)")
                            .attr("stroke","rgba(50,50,50,1)")                            
                            .on("click",resetBoards)
                            .style("cursor", "pointer")  

let reset = svg.append("text").text("Reset")
                            .attr("y",247+width/4)
                            .attr("x",width/2)
                            .attr("text-anchor","middle")
                            .attr("font-size",30)
                            .attr("dominant-baseline","middle")
                            .attr("font-family","monospace")
                            .on("click",resetBoards)
                            .style("cursor", "pointer")  

//Chess Board

let boardSpace = svg.append("g").attr("transform",`translate(0 100)`)

class chessBoard{
    constructor(locX=0,locY=0,target=boardSpace,edge=nEdge,sqSize=squareSize){
        this.locX = locX
        this.locY = locY 
        this.edge=edge        
        this.sqSize=sqSize
        this.queenGlyphs = []   
        this.target = target
        this.queens = this.getBlankBoard()     
        this.checkChecks()
        this.group = this.target.append("g").attr("transform",`translate(${locX} ${locY})`)
        this.boardRect = this.group.append("rect").attr("x",0)
                                    .attr("y",0)
                                    .attr("height",sqSize*this.edge)
                                    .attr("width",sqSize*this.edge)
                                    .attr("fill","white")
                                    .attr("stroke","black")
                                    .attr("stroke-width",4)
        this.squares = []
        for(let i=0; i<this.edge;i++){
            this.squares[i] = []            
            for(let j=0; j<this.edge;j++){            
                let color = "black"
                if((i+j)%2==0){color = "white"}     
                this.squares[i][j] = this.group.append("rect").attr("x",i*sqSize)
                                                                      .attr("y",j*sqSize)
                                                                      .attr("height",sqSize)
                                                                      .attr("width",sqSize)
                                                                      .attr("fill",color)
            }
        }

        this.counter = this.group.append("text").text(0).attr("x",0).attr("y",edge*sqSize +32 ).attr("fill","black").attr("font-size",32).attr("font-family","monospace")
        this.setGlyphs = this.group.append("g").attr("transform",`translate(${((sqSize*this.edge)-145)/2} -10)`)
        this.rows = this.setGlyphs.append("text").text("rows").attr("x",0).attr("y",0).attr("fill","black").attr("font-size",20).attr("font-family","monospace")
        this.cols = this.setGlyphs.append("text").text("cols").attr("x",50).attr("y",0).attr("fill","black").attr("font-size",20).attr("font-family","monospace")
        this.diags = this.setGlyphs.append("text").text("diag").attr("x",100).attr("y",0).attr("fill","black").attr("font-size",20).attr("font-family","monospace")
        
    }
        
    getBlankBoard(){
        let board = []
        for(let i=0; i<this.edge;i++){          
            board[i] = []            
            for(let j=0; j<this.edge;j++){
                board[i][j] = false
            }
        }
        return board
    }
 
    getQueenCoords(queens = this.queens){
        let coords = []
        for(let i=0; i<this.edge;i++){
            for(let j=0; j<this.edge;j++){
                if(queens[i][j]){                    
                    coords.push([i,j])
                }
            }
        }        
        return coords
    }

    getEmptyCoords(queens = this.queens){
        let coords = []
        for(let i=0; i<this.edge;i++){
            for(let j=0; j<this.edge;j++){
                if(!queens[i][j]){
                    coords.push([i,j])
                }
            }
        }
        return coords
    }

    getSuccessors(queens = this.queens,rows=false,cols=false,diags=false){        
        let successors = []
        let currQueenCoords = this.getQueenCoords(queens)        
        if(currQueenCoords.length<this.edge){
            let nextQueenCoords = this.getEmptyCoords(queens)            
            let occupiedRows = []
            let occupiedCols = []

            if(rows){            
                for(let n = 0; n<currQueenCoords.length;n++){
                    occupiedRows.push(currQueenCoords[n][1])
                }
            }
            if(cols){            
                for(let n = 0; n<currQueenCoords.length;n++){
                    occupiedCols.push(currQueenCoords[n][0])
                }
            }        

            let next = []
            let legal = true
            for(let n = 0; n<nextQueenCoords.length;n++){
                legal = true
                
                if(rows){
                    if(occupiedRows.includes(nextQueenCoords[n][1])){
                        legal = false
                    }
                }
                if(cols){
                    if(occupiedCols.includes(nextQueenCoords[n][0])){
                        legal = false
                    }
                }
                if(diags){
                    for(let i = 0; i<currQueenCoords.length;i++){
                        let shiftX = nextQueenCoords[n][0] - currQueenCoords[i][0] 
                        let shiftY = nextQueenCoords[n][1] - currQueenCoords[i][1]   
                        if(Math.abs(shiftX)==Math.abs(shiftY)){
                            legal = false   
                            break                     
                        }                    
                    }
                }

                if(legal){
                next = JSON.parse(JSON.stringify(queens)) 
                next[nextQueenCoords[n][0]][nextQueenCoords[n][1]] = true
                successors.push(next)
                }
            }
        }               
        return successors
    }
    
    checkChecks(queens = this.queens){
        let allSafe = true
        let queenCoords = this.getQueenCoords(queens)
        
        //columns
        let xCoords = []
        queenCoords.forEach(function(element){xCoords.push(element[0])})        
        let xDuplicateFinder = xCoords => xCoords.filter((item, index) => xCoords.indexOf(item) !== index)
        let xDuplicates = xDuplicateFinder(xCoords)
        allSafe = xDuplicates.length==0

        //rows
        if(allSafe){
        let yCoords = []
        queenCoords.forEach(function(element){yCoords.push(element[1])})        
        let yDuplicateFinder = yCoords => yCoords.filter((item, index) => yCoords.indexOf(item) !== index)
        let yDuplicates = yDuplicateFinder(yCoords)
        allSafe = yDuplicates.length==0
        }
        
        //diagonals
        for(let n=0;n<queenCoords.length;n++){
            if(!allSafe){break}
            for(let i=0;i<queenCoords.length;i++){
                if(n!=i){
                    let shiftX = queenCoords[i][0] - queenCoords[n][0]
                    let shiftY = queenCoords[i][1] - queenCoords[n][1]
                    if(Math.abs(shiftX)==Math.abs(shiftY)){
                        allSafe = false
                        break
                    }
                }            
            }
        }
        return allSafe        
    }

    isGoal(queens = this.queens){
        let goal = false
        let queenCoords = this.getQueenCoords(queens)
        if(queenCoords.length==this.edge){
            goal = this.checkChecks(queens)            
        }
        if(goal){this.boardRect.attr("stroke","green").attr("stroke-width","6")}
        
        return goal
    }

    drawQueens(queens = this.queens){        
        for(let i=0; i<this.queenGlyphs.length;i++){
            this.queenGlyphs[i].remove()            
        }
        this.queenGlyphs=[]        
        for(let i=0; i<this.edge;i++){                      
            for(let j=0; j<this.edge;j++){
                if(queens[i][j]){
                    this.queenGlyphs.push(this.group.append("svg:image")
                                        .attr("xlink:href", "queen.png")
                                        .attr("width", this.sqSize)
                                        .attr("height", this.sqSize)
                                        .attr("x", i*this.sqSize)
                                        .attr("y",j*this.sqSize)
                                    )
                }
            }
        }        
    }

    clearBoard(){
        this.group.remove()
    }
}

//Solver

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

class dfsSolver {
    constructor(board=new chessBoard(0,0),rows=false,cols=false,diags=false){
        this.board = board
        this.stack = [this.board.queens]
        this.rows = rows
        this.cols = cols
        this.diags = diags
        this.steps = 0 
        this.solved = false //only used for step-wise solving
        this.visited = []

        function colorState(state){
            if(state){return "black"}else{return "rgba(0,0,0,.25)"}
        }
        this.board.rows.attr("fill",colorState(this.rows))
        this.board.cols.attr("fill",colorState(this.cols))
        this.board.diags.attr("fill",colorState(this.diags))
    }

    solve(showProgress = false){
        let current = []
        
        while(this.stack.length>0){
            this.steps++            
            current = this.stack.pop()             
            if(!this.visited.includes(current)){
                if(showProgress && steps%10==0){
                    this.board.drawQueens(current)
                }
                if(this.board.isGoal(current)){
                    console.log(`Solution Found in ${this.steps} Steps:`)
                    console.log(current)
                    this.board.drawQueens(current)
                    this.board.counter.text(this.steps)
                    return current
                }
                else{
                    this.visited.push(current)
                    let successors = this.board.getSuccessors(current,this.rows,this.cols,this.diags)
                    //if((this.steps-1)%2==0){
                    ///successors.reverse()
                    //}              
                    successors = shuffle(successors)      
                    this.stack = this.stack.concat(successors)                    
                }
            }
        }
        return false        
    }

    step(showProgress = true){
        if(this.stack.length>0 && !this.solved){
            this.steps++
            this.board.counter.text(this.steps)
            let current = this.stack.pop()
            if(showProgress){
                this.board.drawQueens(current)                
            }
            if(this.board.isGoal(current)){
                console.log(`Solution Found in ${this.steps} Steps:`)
                console.log(current)
                this.board.drawQueens(current)
                this.solved=true                
            }else{
                
                let successors = this.board.getSuccessors(current,this.rows,this.cols,this.diags)
                //if((this.steps-1)%2==0){
                    ///successors.reverse()
                    //}              
                successors = shuffle(successors)      
                this.stack = this.stack.concat(successors)
                return false
            }
        }else{
            return false
        }
    }
}

let squareSize = Math.round((width-5*padding)/(nEdge*4))
console.log(squareSize)
let vizWidth= nEdge*squareSize+padding
let nudge = (width-(vizWidth*4+padding*2))/2
let boardOne = new chessBoard(nudge+padding,0)
let boardTwo = new chessBoard(nudge+padding+vizWidth,0)
let boardThree = new chessBoard(nudge+padding+vizWidth*2,0)
let boardFour = new chessBoard(nudge+padding+vizWidth*3,0)

let solverOne = new dfsSolver(boardOne,false,false,false)
let solverTwo = new dfsSolver(boardTwo,true,false,false)
let solverThree = new dfsSolver(boardThree,true,true,false)
let solverFour = new dfsSolver(boardFour,true,true,true)

function incrementQueens(){    
    nEdge+=1
    nEdge = Math.max(4,nEdge%9)
    resetBoards()        
}

function decrementQueens(){
    nEdge-=1
    nEdge = Math.max(4,nEdge%9)
    resetBoards()    
}

function drawNext(){
    if(!solverOne.solved||!solverTwo.solved||!solverThree.solved||!solverFour.solved)
    {
        if(!solverOne.solved){solverOne.step()}
        if(!solverTwo.solved){solverTwo.step()}
        if(!solverThree.solved){solverThree.step()}
        if(!solverFour.solved){solverFour.step()}
    }else{
        play()
    }
}

function solved(){
    if(solverOne.solved && solverTwo.solved && solverThree.solved && solverFour.solved){
        if(playing==1){play()} 
        return true
    }else{        
        return false
    }
}

animation = setInterval(drawNext, 1000/fps)

let playing = 1
function play(){if(playing==1){playing=0;clearInterval(animation)} 
            else{playing=1; animation = setInterval(drawNext, 1000/fps)}} //not used, but useful     
    
function resetBoards(){
                if(playing==1){play()}                
            
                boardOne.clearBoard()
                boardTwo.clearBoard()
                boardThree.clearBoard()
                boardFour.clearBoard()
            
                squareSize = Math.round((width-5*padding)/(nEdge*4))
                console.log(squareSize)
                vizWidth= nEdge*squareSize+padding
            
                nudge = (width-(vizWidth*4+padding*2))/2
                boardOne = new chessBoard(nudge+padding,0)
                boardTwo = new chessBoard(nudge+padding+vizWidth,0)
                boardThree = new chessBoard(nudge+padding+vizWidth*2,0)
                boardFour = new chessBoard(nudge+padding+vizWidth*3,0)
                
                solverOne = new dfsSolver(boardOne,false,false,false)
                solverTwo = new dfsSolver(boardTwo,true,false,false)
                solverThree = new dfsSolver(boardThree,true,true,false)
                solverFour = new dfsSolver(boardFour,true,true,true)
            
                title.text(`Reducing Search Spaces: ${nEdge}-Queens`)
            }            

play()
