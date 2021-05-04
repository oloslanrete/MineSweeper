var boardArr;   //지뢰찾기 게임판을 2차원 배열로 저장
var mine_count; //지뢰 갯수
var mineList = [];  //지뢰가 설치된 좌표를 리스트로 저장. 게임을 패배했을 때 전체 지뢰의 위치를 보여주는 용도.
var openedCellList = [];    //확인된 셀 좌표를 리스트로 저장.
var game_paused = true; //게임이 진행중인지 정지된 상태인지
var size_x;   //지뢰찾기 게임판 한줄의 길이 
var size_y;

window.addEventListener("load",start_game);

function start_game(){
    var i;
    var j;
    var diffselect = document.getElementById("difficulty_select");
    switch(diffselect.value)
    {
        case "easy":
            size_x = 9;
            size_y = 9;
            mine_count = 10;
            break; 
        case "normal":
            size_x = 16;
            size_y = 16;
            mine_count = 40;
            break;
        case "hard":
            size_x = 30;
            size_y = 16;
            mine_count = 99;
            break;
    }

    mineList = [];
    openedCellList = [];

    //크기만큼 배열 할당
    boardArr = new Array(size_y);
    for(i=0; i<size_y; i++)
    {
        boardArr[i] = new Array(size_x);
    }

    //현재 테이블의 row 수 세기
    var table = document.getElementById("game_table");
    var tbody = document.getElementById("game_table_body");
    var cell_count = tbody.childElementCount;
    
    //debug
    //alert(cell_count);

    //게임 보드 초기화 작업
    //지뢰 깔기. 게임판 칸수만큼 array를 만들어서 범위 내 랜덤한 인덱스를 pop시키면서 해당 위치에 지뢰 설치
    var temparr = new Array(size_x*size_y);
    for(i=0; i<size_x*size_y; i++)
    {
        temparr[i] = i;
    }
    var tempindex;
    for(i=0; i<mine_count; i++)
    {
        tempindex = Math.floor(Math.random() * temparr.length); //temparr 크기 내에서 인덱스를 랜덤으로 정함.
        let row = Math.floor(temparr[tempindex]/size_x);    //temparr[tempindex]를 size_x로 나눈 값이 열 번호
        let col = temparr[tempindex]%size_x;  //temparr[tempindex]를 size_x 모듈러 연산이 행 번호
        boardArr[row][col] = "@";   
        temparr.splice(tempindex,1);    //해당 요소는 더이상 랜덤으로 뽑혀서는 안되므로 배열에서 삭제
        mineList.push([row,col])
    }
    //debug
    for(i=0; i<size_y; i++)
    {
        console.log(boardArr[i]);
    }
    

    //table cells 초기화 작업.
    var newTbody=document.createElement("tbody");
    var tempTr;
    var tempTh;
    newTbody.setAttribute("id","game_table_body");
    for(i=0; i<size_y; i++)
    {
        tempTr=document.createElement("tr");
        for(j=0; j<size_x; j++)
        {
            tempTh=document.createElement("th");
            tempTh.setAttribute("id","cell"+i+","+j);
            tempTh.setAttribute("data-y",i);    //i row y
            tempTh.setAttribute("data-x",j);    //j col x
            tempTh.setAttribute("data-opened", false);   // 한번이라도 확인된 셀인지 아닌지
            tempTh.setAttribute("class","cell");
            
            tempTr.appendChild(tempTh);
        }
        newTbody.appendChild(tempTr);
    }
    table.replaceChild(newTbody, tbody);
    game_paused=false;

    cells = document.getElementsByClassName("cell");
    console.log(cells)
    for(let cell of cells)
    {
        cell.addEventListener("mouseup", function(e){

            if(e.button == 0)
            {
                CheckCell(cell);
            }
            else if(e.button == 2)
            {
                SetFlag(cell)
            }
        });
        //cell들은 기본 contextmenu(우클릭) 이벤트 없앰. 우클릭은 깃발꼽는데 사용.
        cell.addEventListener("contextmenu", e => {
            e.preventDefault();
        });
    }
    return;
}
//click cell
function CheckCell(cell)
{
    if(game_paused)
    {
        return;
    }
    if(cell.getAttribute("data-opened")=="true")
    {
        //이미 확인한 셀일 경우 더 할 일이 없음.
        return;
    }

    var coordx = Number(cell.getAttribute("data-x"));
    var coordy = Number(cell.getAttribute("data-y"));
    var i,j;
    var count=0;

    
    cell.setAttribute("data-opened",true);

    if(boardArr[coordy][coordx]=="@")   //y row, x col
    {
        cell.innerText = "@";
        Lose();
        return;
    }

    openedCellList.push([coordy, coordx]);

    for(i=coordx-1; i<=coordx+1; i++)
    {
        for(j=coordy-1; j<=coordy+1; j++)
        {
            if(i>=0 && i<size_x && j>=0 && j<size_y)
            {
                if(boardArr[j][i] == "@")
                {
                    count++;
                }
            }
        }
    }
    cell.innerText = count;
    cell.classList.add("cell_"+count);
    if(count == 0)
    {
        CheckNeighborCell(cell);
    }
    
    if(openedCellList.length == size_x*size_y - mine_count)
    {
        Win();
    }
    return;
}
function Win()
{
    game_paused=true;
    alert("you win");
    printAllMines();
}
function Lose()
{
    game_paused=true;
    printAllMines();
    alert("you lose");
}

function CheckNeighborCell(cell)
{
    var coordx = Number(cell.getAttribute("data-x"));
    var coordy = Number(cell.getAttribute("data-y"));
    var i,j;
    for(i=-1; i<2; i++)
    {
        for(j=-1; j<2; j++)
        {
            nextId = "cell"+(coordy+i)+","+(coordx+j);  //y,x y가 row x가 col
            nextCell = document.getElementById(nextId);
            if(nextCell != null)
            {
                CheckCell(nextCell);
            }
        }
    }
}

function printAllMines()
{
    var i;
    var cellId;
    for(i=0; i<mineList.length; i++)
    {
        cellId = "cell"+mineList[i][0]+","+mineList[i][1];
        document.getElementById(cellId).innerText="@";
    }
}
//right click cell
function SetFlag(cell)
{
    if(game_paused)
    {
        return;
    }
    if(cell.innerText=="")
    {
        cell.innerText="V";
    }
    else if(cell.innerText=="V")
    {
        cell.innerText = ""
    }
}