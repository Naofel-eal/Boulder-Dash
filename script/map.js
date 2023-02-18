export class Map
{
    #level;
    #player
    #totalDiamonds

    constructor(player)
    {
        this.createGrid();
        this.#player = player;
        if(localStorage.getItem("actualLevel") === null || localStorage.getItem("actualLevel") > localStorage.getItem("levelOrder").length)
        {
            localStorage.setItem("actualLevel", 1); 
        }
        this.#level = localStorage.getItem("actualLevel");
        this.#totalDiamonds = this.searchAllDiamonds();
        this.displayMap();
    }

    get totalDiamonds() {return this.#totalDiamonds;}

    createGrid() //FONCTION POUR CREER LA GRILLE DE DIV HTML
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
                document.getElementById(`line-${y}`).appendChild(cElement);
                x++;

                if(document.getElementById(`line-${y}`).children.length==nColumns)
                {
                    y++;
                    x=0;
                }
            }
        }
    }

    async loadMap() //CHARGER UN FICHIER MAP
    {
        localStorage.setItem("levelOrder", 123);
        await Promise.all
        ([
            fetch('../map/1.txt').then(x => x.text()),
            fetch('../map/2.txt').then(x => x.text()),
            fetch('../map/3.txt').then(x => x.text())
        ]).then(([sampleResp, sample2Resp, sample3Resp]) => 
        {
            localStorage.setItem(`level1`, sampleResp);
            localStorage.setItem(`level2`, sample2Resp);
            localStorage.setItem(`level3`, sample3Resp);
        });
        this.#totalDiamonds = this.searchAllDiamonds();
        this.displayMap();
    }

    displayMap() //AFFICHER LE NIVEAU
    {
        var map = localStorage.getItem("actualMap");
        for(var i=0; i< 16; i++)
        {
            for(var j=0; j< 32; j++)
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

    checkRock() //VERIFIER SI LES ROCHERS DOIVENT TOMBER
    {
        var map = localStorage.getItem("actualMap");
        for(var i=0; i< 32; i++)
        {
            var rockPos = i;
            while(Math.trunc(rockPos/34) < 16)
            {
                var map = localStorage.getItem("actualMap");
                if(map[rockPos] == 'R' && map[rockPos+34] == 'V')
                {
                    this.#player.modifyMap(rockPos, 'V');
                    this.#player.modifyMap(rockPos+34, 'R');
                }
                rockPos++;
            }
        }
    }

    checkDiamond() //VERIFIER SI TOUS LES DIAMANTS SONT RECUPERES
    {
        if(this.#player.diamonds == this.#totalDiamonds)
        {
            var oldLevel = parseInt(localStorage.getItem("actualLevel"));
            var nextLevel = localStorage.getItem("levelOrder")[this.#level];
            if(this.#level == localStorage.getItem("levelOrder").length)
            {
                alert("Tu as fini le jeu !!!    ");
                localStorage.setItem("movements", 0);
                localStorage.setItem("diamonds", 0);
                localStorage.setItem("actualMap", 0);
                localStorage.setItem("actualLevel", 1);
                localStorage.setItem("actualMap", localStorage.getItem(`level${localStorage.getItem("levelOrder")[0]}`))
                window.location.replace("../index.html");
            }
            else
            {
                alert(`Tu as fini le niveau ${localStorage.getItem("actualLevel")} ! Passons au prochain niveau !`);
                localStorage.setItem("actualLevel", ++oldLevel);
                this.#level++;
                localStorage.setItem("actualMap", localStorage.getItem(`level${nextLevel}`))
                this.#player.restore();
                this.#totalDiamonds = this.searchAllDiamonds();
                this.displayMap();
            }
        }
    }
    
    searchAllDiamonds() //CHERCHER TOUS LES DIAMANTS DU NIVEAU
    {
        var map = localStorage.getItem("actualMap");
        var diamonds=0;
        for(var i=0; i< 16; i++)
        {
            for(var j=0; j<32; j++)
            {
                if(map[i*34 + j]=='D')
                {
                    diamonds++;
                }
            }
        }
        return diamonds;
    }

    async deadAnimation() //ANIMATION DE LA MORT
    {

        var position = this.#player.getPlayerPosition();
        var idMurder = `${Math.trunc(position%34)}-${Math.trunc(position/34)-1}`; //ID DU DIV OU EST LE ROCHER
        document.getElementById(idMurder).style.cssText = 
        `
        background-image: url('../textures/empty.png'); 
        background-repeat: no-repeat;
        background-size: 100%;
        `;
        var idPlayer = `${Math.trunc(position%34)}-${Math.trunc(position/34)}`; //ID DU DIV OU EST LE PLAYER
        document.getElementById(idPlayer).style.cssText = 
        `
        background-image: url('../textures/explode.gif'); 
        background-repeat: no-repeat;
        background-size: 100%;
        `;
        var audio = new Audio("../sound/explode.wav");
        await audio.play();
        await delay(1000);
        this.restore();
    }

    restore() //RESTAURER LA MAP A SON ETAT INITIAL
    {
        var levelNumber = localStorage.getItem(`levelOrder`)[this.#level-1];
        this.createGrid();
        localStorage.setItem("actualMap", localStorage.getItem(`level${levelNumber}`))
        this.#player.restore();
        this.#totalDiamonds = this.searchAllDiamonds();
        document.querySelector("#diamonds").innerHTML = `Diamants : ${localStorage.getItem("diamonds")} / ${this.searchAllDiamonds()}`;
        document.querySelector("#movements").innerHTML = `Mouvements : ${this.#player.movements}`;
        document.querySelector("#help").innerHTML = "";
        this.displayMap();
    }
}

function delay(time) //FONCTION POUR FAIRE UNE PAUSE DE "TIME" SECONDES
{
    return new Promise(resolve => setTimeout(resolve, time));
}
  