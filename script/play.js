import { Map } from "./map.js"
import { Player } from "./player.js"
import { World } from "./world.js"

removeSave();

var player = new Player();
var map = new Map(player);
var world = new World(map, player);
world.refresh();


document.getElementById("reload").addEventListener('click',function () //SI ON CLICK SUR LE BOUTON POUR RECOMMENCER
{
    if(window.confirm("Etes vous sur de vouloir recommencer le niveau ?"))
    {
        map.restore();
        world.refresh();
    }
}); 

document.getElementById("home").addEventListener('click',function () //SI ON CLICK SUR LE BOUTON RETOUR
{
    if(window.confirm("Etes vous sur de vouloir retourner au menu principal ?"))
    {
        window.location.replace("../index.html");
    }
}); 

window.addEventListener('keydown', async function (e) //DETECTE L APPUIE D UNE TOUCHE
{
    if(e.key == "z" || e.key == "q" || e.key == "s" || e.key == "d")
    {
        if(localStorage.getItem("dead") != 1)
        {
            player.move(e.key);
            if(player.dead == 0)
            {
                map.checkRock();
                map.displayMap();
                player.checkDeath();
                map.checkDiamond();
            }
            else
            {
                await map.deadAnimation();
            }
        }
    }

    if(e.key == "Z" || e.key == "Q" || e.key == "S" || e.key == "D")
    {
        document.querySelector("#help").innerHTML = "ATTENTION: Touche MAJ enfoncée";
    }
    world.refresh();
}, false);

function removeSave() //SUPPRIMER LA SAUVEGARDE
{
    localStorage.setItem("movements", 0);
    localStorage.setItem("diamonds", 0);
    localStorage.setItem("actualLevel", 1);
    localStorage.setItem("actualMap", localStorage.getItem(`level${localStorage.getItem("levelOrder")[0]}`));
}