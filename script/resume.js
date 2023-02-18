import { Map } from "./map.js"
import { Player } from "./player.js"
import { World } from "./world.js"

var player = new Player();
var map = new Map(player);
var world = new World(map, player);

document.getElementById("reload").addEventListener('click',function ()
{
    if(window.confirm("Etes vous sur de vouloir recommencer le niveau ?"))
    {
        map.restore();
        world.refresh();
    }
}); 

document.getElementById("home").addEventListener('click',function ()
{
    if(window.confirm("Etes vous sur de vouloir retourner au menu principal ?"))
    {
        window.location.replace("../index.html");
    }
}); 

window.addEventListener('keydown', async function (e) //DETECTE L APPUIE D UNE TOUCHE
{
    if(e.key == "z" || e.key == "q" || e.key == "s" || e.key == "d" )
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
    world.refresh();
}, false);