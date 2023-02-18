window.addEventListener('load',function ()
{
    localStorage.removeItem("selectedElement");
    createGrid();
    addListenerToSelectElement();
    refreshMap();
    if(localStorage.getItem("appearance") == 0)
    {
        document.body.style.backgroundColor = "#FFFBE3";
        document.querySelector(".appearance").style.cssText = "filter: invert(0);";
    }
    else
    {
        document.body.style.backgroundColor = "black";
        document.querySelector(".appearance").style.cssText += "filter: invert(1);";
    }
}); 

document.querySelector(".reset").addEventListener('click', function()
{
    restoreMap();
});

document.querySelector(".save").addEventListener('click', function()
{
    if(checkPlayer() == false)
    {
        alert("Il doit y avoir UN joueur sur la map !")
    }
    else if(checkDiamonds() == false)
    {
        alert("Il doit y avoir au moins un diamant sur la map !");
    }
    else
    {
        getLevelNumber();
        alert("Niveau ajouté !");
        window.location.replace("../index.html");
    }
});

var originalMap = `MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\n\MTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTM\r\nMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM`
localStorage.setItem("levelCreated", originalMap);

function createGrid() //FONCTION POUR CREER LA GRILLE DE DIV HTML
{
    const nLines = 16;
    const nColumns = 32;
    let x=0;
    let y=0;
    
    //ON VIDE LA GRILLE SI ELLE EXISTE DEJA
    document.querySelector("#grid").innerHTML = "";
    //CONSTRUCTION DE LA GRILLE
    for(let i=0; i< nLines; i++)
    {
        //CONSTRUCTION DES LIGNES
        const lElement = document.createElement('div');
        lElement.id = 'line-' + i;
        document.querySelector('#grid').appendChild(lElement);
        
        for(let j=0; j< nColumns; j++)
        {
            //CONSTRUCTION DE CHAQUE CELLULES DES LIGNES
            const cElement = document.createElement('div');
            cElement.id = x + '-' + y;
            cElement.value =0;
            document.getElementById(`line-${y}`).appendChild(cElement);
            x++;

            cElement.addEventListener("mouseover", function(event) //SI ON SURVOLE L ELEMENT
            {
                var selected = localStorage.getItem("selectedElement");
                if(selected != null)
                {
                    selected = capitalizeFirstLetter(selected);
                    this.style.cssText = 
                    `
                        background-image: url("../textures/${selected}.png");
                        background-size: 100%;
                    `
                }
            });

            cElement.addEventListener("mouseleave", function(event) //SI ON QUITTE L ELEMENT
            {
                refreshMap();
            });
            

            cElement.addEventListener("click", function(event) //SI ON CLICK SUR L ELEMENT
            {
                var selected = localStorage.getItem("selectedElement");
                if(selected != null) 
                {
                    selected = capitalizeFirstLetter(selected);
                    this.value = 1;
                    this.style.cssText = 
                    `
                        background-image: url("../textures/${selected}.png");
                        background-size: cover;
                    `
                    var x = parseInt(this.id.split('-')[1]);
                    var y = parseInt(this.id.split('-')[0]);
                    var map = localStorage.getItem("levelCreated");
                    switch(selected)
                    {
                        case 'Miner':
                            modifyStr(map, x*34+y, 'P');
                            break;
                        case 'Diamond':
                            modifyStr(map, x*34+y, 'D');
                            break;
                        case 'Rock':
                            modifyStr(map, x*34+y, 'R');
                            break;
                        case 'Earth':
                            map = modifyStr(map, x*34+y, 'T');
                            break;
                        case 'Brick':
                            modifyStr(map, x*34+y, 'M');
                            break;
                        case 'Empty':
                            modifyStr(map, x*34+y, 'v');
                            break;
                    }
                }
            });


            if(document.getElementById(`line-${y}`).children.length==nColumns)
            {
                y++;
                x=0;
            }
        }
    }
}

function addListenerToSelectElement() //AJOUTER UN LISTENER A TOUS LES DIVS DE SELECTIONS D OBJET
{
    var select= document.querySelectorAll("#element");
    for(var i = 0; i < select.length; i++)
    {
        select[i].addEventListener("click", function(event) 
        {
            localStorage.setItem("selectedElement", this.className)
            if(localStorage.getItem("selectedElement") == this.className)
            {
                var allElement = document.querySelectorAll("#element");
                for(var i =0; i<allElement.length; i++)
                {
                    allElement[i].style.cssText = 
                    `
                        display: flex;
                        justify-content: left;
                        background: linear-gradient(90deg, #49168c, #070707);
                        height: 100%;
                        width: 100%
                        cursor: pointer ;
                    `
                }
                document.querySelector(`.${this.className}`).style.cssText += `background: linear-gradient(90deg, #49168c, #6c2c2c);`
            }
            refreshMap();
        });
    }
}

function capitalizeFirstLetter(string) //METTRE EN MAJUSCULE LA PREMIERE LETTRE DU MOT
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}  

function modifyStr(str,index,chr) //MODIFIER LA MAP
{
    if(index > str.length-1)
    {
        console.log("Index trop grand")
    }
    localStorage.setItem("levelCreated", str.substring(0,index) + chr + str.substring(index+1));
}

function restoreMap() //RESTAURER LA MAP
{
    var map = localStorage.getItem("levelCreated");
    for(var i =32 ; i< map.length-32; i++)
    {
        if(map[i] == 'D' || map[i] == 'P' || map[i] == 'R' || map[i]== 'V' || map[i] == 'M' && i%33!=0 && i%33!=31)
        {
            modifyStr(map, i, 'T');
        }
        map = localStorage.getItem("levelCreated");    
    }
    refreshMap();
}

function refreshMap() //ACTUALISER LA MAP
{
    var map = localStorage.getItem("levelCreated")
    for(var i =0; i< 16; i++)
    {
        for(var j=0; j<34; j++)
        {
            var cElement = document.getElementById(`${j}-${i}`);
            switch(map[i*34 + j]) //CHARGEMENT DES TEXTURES
            {
                case "M":
                    cElement.style.cssText = `
                        background-image: url('../textures/Brick.png'); 
                        background-repeat: no-repeat;
                        background-size: cover;
                        `
                    break;
                case "D":
                    cElement.style.cssText = `
                        background-image: url('../textures/Diamond.png'); 
                        background-repeat: no-repeat;
                        background-size: cover;
                        `
                    break;    
                case "T":
                    cElement.style.cssText = `
                        background-image: url('../textures/Earth.png'); 
                        background-repeat: no-repeat;
                        background-size: cover;
                        `
                    break;
                case "R":
                    cElement.style.cssText = `
                        background-image: url('../textures/Rock.png'); 
                        background-repeat: no-repeat;
                        background-position: center;
                        background-size: 80%;
                        `
                    break;
                case "P":
                    cElement.style.cssText = `
                    background-image: url('../textures/Miner.gif'); 
                    background-repeat: no-repeat;
                    background-size: cover;
                    `
                    break;
                case "V":
                    cElement.style.cssText = `
                    background-image: url('../textures/Empty.png'); 
                    background-repeat: no-repeat;
                    background-size: cover;
                    `
                    break;
            }
        }
    }
}

function checkPlayer() //VERIFIER S IL EXISTE DEJA UN JOUEUR SUR LA MAP
{
    var map = localStorage.getItem("levelCreated")
    var playerFind = 0;
    for(var i=0; i<map.length; i++)
    {
        if(map[i] == 'P')
        {
            playerFind++;
        }
    }
    if(playerFind > 1 || playerFind == 0)
    {
        return false;
    }
    else
    {
        return true;
    } 
}

function checkDiamonds() //VERIFIER S IL Y A ASSEZ DE DIAMANT
{
    var map = localStorage.getItem("levelCreated")
    var playerFind = 0;
    for(var i=0; i<map.length; i++)
    {
        if(map[i] == 'D')
        {
            return true;
        }
    }
    return false;
}

function getLevelNumber()
{
    for (var i=0; i< localStorage.length; i++)
    {
        if(localStorage.getItem(`level${i+4}`) == null)
        {
            localStorage.setItem(`level${i+4}`, localStorage.getItem("levelCreated"));
            var order = localStorage.getItem("levelOrder");
            localStorage.setItem("levelOrder", order+(i+4));
            return;
        }
    }
}


document.querySelector(".appearance").addEventListener("click", () => 
{
    if(localStorage.getItem("appearance") == 0)
    {
        localStorage.setItem("appearance", 1);
        document.body.style.backgroundColor = "black";
        document.querySelector(".appearance").style.cssText = "filter: invert(1);";
        return;
    }

    if(localStorage.getItem("appearance") == 1)
    {
        localStorage.setItem("appearance", 0);
        document.body.style.backgroundColor = "#FFFBE3";
        document.querySelector(".appearance").style.cssText = "filter: invert(0);";
        return;
    }
});