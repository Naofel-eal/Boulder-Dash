if(localStorage.getItem("levelOrder") === null)
{
    localStorage.clear();
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
}

if(localStorage.getItem("actualLevel") > localStorage.getItem("levelOrder").length)
{
    localStorage.setItem("actualLevel", 1)
}

if(localStorage.getItem("appearance") === null)
{
    localStorage.setItem("appearance", 0);
}
else
{
    if(localStorage.getItem("appearance") == 1)
    {
        document.body.style.backgroundColor = "black";
        document.querySelector(".appearance").style.cssText = "filter: invert(1);";
    }
    if(localStorage.getItem("appearance") == 0)
    {
        document.body.style.backgroundColor = "#FFFBE3";
    }
}

document.querySelector(".appearance").addEventListener("click", () => 
{
    if(localStorage.getItem("appearance") == 0)
    {
        localStorage.setItem("appearance", 1);
        location.reload();
        return;
    }

    if(localStorage.getItem("appearance") == 1)
    {
        localStorage.setItem("appearance", 0);
        location.reload();
    }
});

document.querySelector(".resume").addEventListener('click', () =>
{
    if(localStorage.getItem("actualMap") === null)
    {
        alert("Vous n'avez commencé aucune partie ! ");
        window.location.replace("../index.html");
    }
    else
    {
        window.location.replace("../pages/resume.html");
    }
});

