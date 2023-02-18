window.addEventListener('load', function() //AFFICHER LE CONTENU DU FICHIER UPLOADE
{
    if(this.localStorage.getItem("levelOrder") === null)
    {
        this.localStorage.setItem("levelOrder", 123);
    }
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
    listLevels();
});

window.addEventListener('storage', function(e)  //SI ON MODIFIE L ORDRE DES NIVEAUX DANS LE LOCAL STORAGE
{  
    if (e.key === "levelOrder") 
    {
        listLevels();
    }
});

document.querySelector("#file").addEventListener('change', function(e) //AFFICHER LE CONTENU DU FICHIER UPLOADE
{
    if(document.querySelector("#file").value != "") 
    {
        const reader = new FileReader() 
        reader.addEventListener('load', function(event) 
        {
            if(checkCorrectFile(event.target.result) == true) //SI LE FICHIER EST CONFORME ON L AJOUTE AU LOCALSTORAGE
            {
                for (var i = 1; i <= localStorage.length; i++) 
                {
                    if(localStorage.getItem(`level${i}`) === null)
                    {
                        localStorage.setItem(`level${i}`, event.target.result);
                        localStorage.setItem("levelOrder", `${localStorage.getItem("levelOrder")}${i}` )
                        listLevels();
                        break;
                    }
                }
            }
        })
        reader.readAsText(e.target.files[0])
    }
});

localStorage.removeItem("actualLevel")

function listLevels() //CREATION D UN DIV POUR STOCKER LES NIVEAUX 
{
    var oldOrder = localStorage.getItem("levelOrder");
    document.querySelector('#list').innerHTML = "";
    document.querySelector('#list').innerHTML += "<h2>Ordre des niveaux</h2>";
    for(var i=1; i<= oldOrder.length; i++)
    {
        const level = document.createElement('div');
        document.querySelector('#list').appendChild(level);
        level.id = `level${oldOrder[i-1]}`;
        level.style.cssText = `
        position: relative;
        width: 800px;
        margin-top: 50px;
        padding: 20px;
        background-color: #ff722e26;
        display: flex;        
        `

        level.innerHTML = `<h2>Niveau ${i}</h2>`;
        level.innerHTML += `<a id="delete${oldOrder[i-1]}" class="del"></a>`;
        
        if(i != 1)
        {
            level.innerHTML += `<a id="up${oldOrder[i-1]}" class="up"></a>`;
        }
        if(i != oldOrder.length)
        {
            level.innerHTML += `<a id="down${oldOrder[i-1]}" class="down"></a>`;
        }
        
        level.innerHTML += `<div id="grid${oldOrder[i-1]}"></div>`;
    }
    createGrid();
    displayMap();
    delLevel();
    upLevel();
    downLevel();
}

function createGrid() //FONCTION POUR CREER LA GRILLE DE CHAQUE MAP
{
    var oldOrder = localStorage.getItem("levelOrder");
    const nLines = 16;
    const nColumns = 32;
    let x=0;
    let y=0;

    for(var j=1; j<= oldOrder.length; j++) //POUR TOUS LES LEVELS
    {
        document.querySelector(`#grid${oldOrder[j-1]}`).innerHTML = "";
        document.querySelector(`#grid${oldOrder[j-1]}`).style.cssText =
        `
            self-align: center;
            display: flex;
            flex-direction: column;
            width: fit-content;
            height: 160px;
            border: none;
            background-color:black;
            margin-left: 100px;
        `
        //CONSTRUCTION DE LA GRILLE
        for(var i=0; i< nLines; i++) 
        {
            //CONSTRUCTION DES LIGNES
            const lElement = document.createElement('div');
            lElement.id = `level-${oldOrder[j-1]}-line-${i}`;
            document.querySelector(`#grid${oldOrder[j-1]}`).appendChild(lElement);
            
            for(let k=0; k< nColumns; k++)
            {
                //CONSTRUCTION DE CHAQUE CELLULES DES LIGNES
                const cElement = document.createElement('div');
                cElement.id =`${oldOrder[j-1]}-${i}-${k}`;
                document.getElementById(`level-${oldOrder[j-1]}-line-${i}`).appendChild(cElement);
            }
        }
    }
}

function displayMap() // AFFICHAGE DE LA MAP DE CHAQUE LEVEL
{
    var oldOrder = localStorage.getItem("levelOrder");

    for(var i=1; i<= oldOrder.length; i++)
    {
        var map = localStorage.getItem(`level${oldOrder[i-1]}`);       
        for(var j=0; j< 16; j++)
        {
            document.querySelector(`#level-${oldOrder[i-1]}-line-${j}`).style.cssText =
            `display: flex;
            width: 320px;
            height: 100%;
            border: none;`;

            for(var k=0; k< 32; k++)
            {
                var cElement = document.getElementById(`${oldOrder[i-1]}-${j}-${k}`);
                switch(map[j*34 + k]) //CHARGEMENT DES TEXTURES
                {
                    case "M":
                        cElement.style.cssText = `
                            height: 10px;
                            width: 10px;
                            background-image: url('../textures/Brick.png'); 
                            background-repeat: no-repeat;
                            background-size: cover;
                            border: none;
                            `
                        break;
                    case "D":
                        cElement.style.cssText = `
                            height: 10px;
                            width: 10px;
                            background-image: url('../textures/Diamond.png'); 
                            background-repeat: no-repeat;
                            background-size: cover;
                            border: none;
                            `
                        break;    
                    case "T":
                        cElement.style.cssText = `
                            height: 10px;
                            width: 10px;
                            background-image: url('../textures/Earth.png'); 
                            background-repeat: no-repeat;
                            background-size: cover;
                            border: none;
                            `
                        break;
                    case "R":
                        cElement.style.cssText = `
                            height: 10px;
                            width: 10px;
                            background-image: url('../textures/Rock.png'); 
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: 80%;
                            border: none;
                            `
                        break;
                    case "P":
                        cElement.style.cssText = `
                        height: 10px;
                        width: 10px;
                        background-image: url('../textures/Miner.gif'); 
                        background-repeat: no-repeat;
                        background-size: cover;
                        border: none;
                        `
                        break;
                    case "V":
                        cElement.style.cssText = `
                        height: 10px;
                        width: 10px;
                        background-image: url('../textures/Empty.png'); 
                        background-repeat: no-repeat;
                        background-size: cover;
                        border: none;
                        `
                        break;
                }
            }
        }
    }
}

function delLevel() //FONCTION POUR SUPPRIMER UN NIVEAU DE LA LISTE DES NIVEAUX
{
    var elements = document.querySelectorAll(".del");
    for (var i = 0; i < elements.length; i++) 
    {
        elements[i].addEventListener("click", function(event) 
        {
            modifyOrder(getLevelOrder(this.id[6]), "");
            listLevels();
        });
    }
}

function modifyOrder(index, chr) //FONCTION POUR MODIFIER L ORDRE DES NIVEAUX
{
    var str= localStorage.getItem(`levelOrder`);
    if(index > str.length-1)
    {
        return str;
    }
    localStorage.setItem(`levelOrder` , str.substring(0,index) + chr + str.substring(index+1));
}

function getLevelOrder(level) //RECUPERER L INDEX D UN NIVEAU DANS LA LISTE
{
    var order = localStorage.getItem("levelOrder")
    for(var i=0; i<order.length; i++)
    {
        if(order[i] == level)
        {
            return i;
        }
    }
    return null;
}

function checkCorrectFile(map) //VERIFIER QUE LE FICHIER UPLOADE EST CORRECT
{
    var allChar =[];
    if(map.length != 542)
    {
        alert(`taille incorrecte: ${map.length}`);
        return false
    }

    var findPlayer=0;
    for(var i=0; i< map.length; i++)
    {
        if(map[i] != 'M' && map[i] != 'T' && map[i] != 'V' && map[i] != 'R' && map[i] != 'P' && map[i] != 'D' && map[i] != '\r' &&  map[i] !='\n')
        {
            alert(`carcatère non accepté: ${map[i]}`);
            return false;
        }
        if(map[i] == 'P')
            findPlayer++;
    }
    
    if(findPlayer != 1)
    {
        alert("Il doit y avoir un joueur sur la map");
        return false;
    }

    alert("Niveau ajouté !")
    return true;
}

function upLevel() //AJOUT DES LISTENER POUR LES FLECHE DU HAUT
{
    var elements = document.querySelectorAll(".up");
    for (var i = 0; i < elements.length; i++) 
    {
        elements[i].addEventListener("click", function(event) 
        {
            var order = localStorage.getItem("levelOrder");
            var mapIndex = getLevelOrder(this.id[2]);
            var mapValue = this.id[2];
            newOrder = modifyStr(order, mapIndex-1, mapValue);
            newOrder = modifyStr(newOrder, mapIndex, order[mapIndex-1])
            localStorage.setItem("levelOrder", newOrder)
            listLevels();
        });
    }
}

function downLevel() //AJOUT DES LISTENER POUR LES FLECHE DU HAUT
{
    var elements = document.querySelectorAll(".down");
    for (var i = 0; i < elements.length; i++) 
    {
        elements[i].addEventListener("click", function(event) 
        {
            var order = localStorage.getItem("levelOrder");
            var mapIndex = getLevelOrder(this.id[4]);
            var mapValue = this.id[4];
            newOrder = modifyStr(order, mapIndex+1, mapValue);
            newOrder = modifyStr(newOrder, mapIndex, order[mapIndex+1])
            localStorage.setItem("levelOrder", newOrder)
            listLevels();
        });
    }
}

function modifyStr(str,index,chr) 
{
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
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