export class Player
{
    #warn;
    #dead;
    #movements;
    #diamonds;
    
    constructor()
    {
        this.#dead = 0;
        if(localStorage.getItem("movements") === null)
        {
            localStorage.setItem("movements", 0);
        }
        else
        {
            this.#movements = localStorage.getItem("movements");
        }
        
        this.#diamonds = 0;
        this.#movements = localStorage.getItem("movements");
        this.#warn = 0;
    }

    get dead(){return this.#dead}
    get movements(){return this.#movements;}
    get diamonds(){return this.#diamonds;}

    async move(key)
    {
        var map= localStorage.getItem(`actualMap`);
        var position = this.getPlayerPosition(map);
        switch(key)
        {
            case 'z':
                if(map[position-34] == 'T' || map[position-34] == 'V') //SI LE JOUEUR RENCONTRE DE LA TERRE OU LE VIDE
                {
                    this.modifyMap(position-34, 'P');
                    this.modifyMap(position, 'V');
                    this.#movements++;
                }
                else if(map[position-34] == 'D') //SI LE JOUEUR RENCONTRE UN DIAMANT
                {
                    var diamondSound = new Audio("../sound/diamond.wav");
                    this.modifyMap(position-34, 'P');
                    this.modifyMap(position, 'V');
                    diamondSound.play();
                    this.#diamonds++;
                    this.#movements++;
                }
                else
                {
                    var wallAudio = new Audio("../sound/wall.wav");
                    wallAudio.play();
                }
                break;

            case 'q':
                if(map[position-1] == 'T' || map[position-1] == 'V')
                {
                    this.modifyMap(position-1, 'P');
                    this.modifyMap(position, 'V');
                    this.#movements++;
                }
                else if(map[position-1] == 'D')
                {
                    var diamondSound = new Audio("../sound/diamond.wav");
                    this.modifyMap(position-1, 'P');
                    this.modifyMap(position, 'V');
                     diamondSound.play();
                    this.#diamonds++;
                    this.#movements++;
                }
                else if(map[position-1] == 'R')
                {
                    if(map[position-2] == 'V')
                    {
                        this.modifyMap(position-2, 'R');
                        this.modifyMap(position-1, 'P');
                        this.modifyMap(position, 'V');
                        this.#movements++;
                    }
                    else
                    {
                        var wallAudio = new Audio("../sound/wall.wav");
                         wallAudio.play();
                    }
                }
                else
                {
                    var wallAudio = new Audio("../sound/wall.wav");
                     wallAudio.play();
                }
                break;

            case 's':
                if(map[position+34] == 'T' || map[position+34] == 'V') //SI LE JOUEUR RENCONTRE DE LA TERRE OU LE VIDE
                {
                    if(this.#warn ==1)
                    {
                        localStorage.setItem('dead', 1);
                        this.modifyMap(position-34, 'V');
                        this.death();
                    }
                    else
                    {
                        this.modifyMap(position+34, 'P');
                        this.modifyMap(position, 'V');
                        this.#movements++;
                    }
                }
                else if(map[position+34] == 'D') //SI LE JOUEUR RENCONTRE UN DIAMANT
                {
                    if(this.#warn ==1)
                    {
                        this.death();
                    }
                    else
                    {
                        var diamondSound = new Audio("../sound/diamond.wav");
                        this.modifyMap(position+34, 'P');
                        this.modifyMap(position, 'V');
                         diamondSound.play();
                        this.#diamonds++;
                        this.#movements++;
                    }
                }
                else
                {
                    if(this.#warn == 1)
                    {
                        this.death();
                    }
                    else
                    {
                        var wallAudio = new Audio("../sound/wall.wav");
                         wallAudio.play();
                        
                    }
                }
                break;

            case 'd':
                if(map[position+1] == 'T' || map[position+1] == 'V')
                {
                    this.#movements++;
                    this.modifyMap(position+1, 'P');
                    this.modifyMap(position, 'V');
                }
                else if(map[position+1] == 'D')
                {
                    var diamondSound = new Audio("../sound/diamond.wav");
                    this.modifyMap(position+1, 'P');
                    this.modifyMap(position, 'V');
                     diamondSound.play();
                    this.#diamonds++;
                    this.#movements++;
                }
                else if(map[position+1] == 'R')
                {
                    if(map[position+2] == 'V')
                    {
                        this.modifyMap(position+2, 'R');
                        this.modifyMap(position+1, 'P');
                        this.modifyMap(position, 'V');
                        this.#movements++;
                    }
                    else
                    {
                        var wallAudio = new Audio("../sound/wall.wav");
                         wallAudio.play();
                    }
                }
                else
                {
                    var wallAudio = new Audio("../sound/wall.wav");
                    wallAudio.play();
                }
                break;
        }
    }

    getPlayerPosition() //RENVOIT LA POSITION DU JOUEUR SUR LA MAP
    {
        var map= localStorage.getItem(`actualMap`)
        for(var i=0; i< map.length ; i++)
        {
            if(map[i]=='P')
            {
                return i;
            }
        }
    }

    modifyMap(index,chr) //FONCTION POUR MODIFIER LA MAP
    {
        var map= localStorage.getItem("actualMap");
        if(index > map.length-1)
        {
            return map;
        }
        localStorage.setItem("actualMap" , map.substring(0,index) + chr + map.substring(index+1));
    }

    async checkDeath() //VERIFIE SI LE JOUEUR DOIT MOURIR
    {
        var map = localStorage.getItem("actualMap");
        var position = this.getPlayerPosition();
        if(map[position] == 'P' && map[position-34] == 'R')
        {
            var warnAudio = new Audio("../sound/warn.wav");
            await warnAudio.play();
            this.#warn = 1;
            document.getElementById("help").innerHTML = `Attention, tu risque de mourir `;
        }
        else
        {
            this.#warn = 0;
            document.getElementById("help").innerHTML = ``;
        }
    }

    death() //ETABLIT QUE LE JOUEUR EST MORT
    {
        this.#dead = 1;     
    }

    restore() //RESTAURE LES ATTRIBUTS DU JOUEUR
    {
        localStorage.setItem("dead", 0)
        this.#dead = 0;
        this.#movements = 0;
        localStorage.setItem("movements", 0);
        this.#diamonds = 0;
        localStorage.setItem("diamonds", 0)
        this.#warn = 0;
    }
}