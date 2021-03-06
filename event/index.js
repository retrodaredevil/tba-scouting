let teams = null;
function sortTeams(){
    if(teams === null){
        return;
    }

    window.location.href = "../sort/" + getQueryString(Object.assign({}, getQueryObject(), {"teams": teams.join(",")}));
}
function onEventCodeEnter(event, inputElement){
    if(event.key === "Enter"){
        const stringValue = inputElement.value;
        setQueryKey("event", stringValue);
        requestEventTeams();
    }
}
function requestEventTeams(){
    const authKey = requestAuthKey();
    const eventKey = getQueryObject()["event"];
    if(eventKey === undefined){
        alert("Please enter an event code or find an event");
    }
    getJsonData("event/" + eventKey, authKey, function(event){
        if(event === null || event === undefined){
            throw "event is null or undefined";
        }
        setIdText("event_name", event.name === undefined ? null : event.name);
        const start_date = event.start_date;
        const end_date = event.end_date;
        let dateString;
        if(start_date === undefined || end_date === undefined){
            dateString = null;
        } else {
            dateString = start_date + " to " + end_date;
        }
        setIdText("date", dateString);
        setIdText("location", event.location_name === undefined ? null : event.location_name);

    }, function(){
        console.log("Couldn't get event data for: " + eventKey);
    });

    getJsonData("event/" + eventKey + "/teams/keys", authKey, function(teamKeys){
        teams = [];
        if(teamKeys === null || teamKeys === undefined){
            setIdHtml("teams", null);
            console.log("teamKeys was null or undefined");
            return;
        }
        console.log("teamKeys: " + teamKeys);
        if(typeof teamKeys[Symbol.iterator] !== "function"){
            setIdHtml("teams", null);
            console.log("teamKeys is not iterable");
            return;
        }
        let teamsHtml = "";
        for(const teamKey of teamKeys){
            const teamNumber = +teamKey.slice(3, teamKey.length);
            teams.push(teamNumber);
            teamsHtml += "<a onclick='onTeamClick(" + teamNumber + ")'>" + teamNumber + "</a><br/>";
        }
        setIdHtml("teams", teamsHtml);
    }, function(){
        console.log("Couldn't get event data for: " + eventKey);
    });
}
function onTeamClick(teamNumber){
    setCurrentTeamNumber(teamNumber);
    location.href = "../team/" + location.search;
}

// (function(){
(function(){ // main function
    setIdText("event_name", null);
    setIdText("date", null);
    setIdText("location", null);
    setIdText("teams", null);

    const event = getQueryObject()["event"];
    if(event === null || event === undefined){
        console.log("no event in query object");
    } else {
        document.getElementById("event_code_input").value = event;
    }

    requestEventTeams();
})();
// })();
