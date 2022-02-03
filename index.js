const { initializeApp } = require('firebase/app');
const { async } = require('@firebase/util');
const { getFirestore, doc, getDoc, updateDoc, setDoc, Timestamp, collection, getDocs, Firestore, query, where } = require('firebase/firestore');



const express = require('express');

const app = express();
let port = process.env.PORT || 3000;


app.get("/", (req, res) => {
    GT();
   
    
    res.send("Hello");
});
app.listen(port, () => {
    console.warn(`App listening on http://localhost:${port}`);
});



const firebaseConfig = {
    apiKey: "AIzaSyC3wcZ1SzJChtFS1rB6aj4qsleeHh2BemQ",
    authDomain: "donalive-982c4.firebaseapp.com",
    databaseURL: "https://donalive-982c4-default-rtdb.firebaseio.com",
    projectId: "donalive-982c4",
    storageBucket: "donalive-982c4.appspot.com",
    messagingSenderId: "250990561449",
    appId: "1:250990561449:web:bcd23090beb599ba8281b8"
};
initializeApp(firebaseConfig)
const db = getFirestore()
const DocRef = doc(db, "SpinnerTimerBools", "TeenPatti")
const UssRef= collection(db,"users")
//const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function sleepNow(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

var Trail = [[4, 4, 4], [1, 1, 1], [12, 12, 12]];
var Pure = [[2, 3, 4], [8, 9, 10], [1, 2, 3], [1, 13, 12], [7, 6, 5]];
var Sequence = [[12, 11, 10], [5, 4, 3], [10, 9, 8], [4, 5, 6], [9, 10, 11], [1, 13, 12], [13, 12, 11]];
var Colorss = [[1, 13, 11], [1, 7, 3], [6, 4, 2], [13, 3, 8], [1, 5, 9], [10, 5, 12], [13, 2, 4], [12, 7, 3], [1, 10, 4], [11, 8, 5]];
var Pair = [[1, 1, 13], [1, 1, 3], [6, 6, 9], [11, 11, 2], [13, 13, 7], [3, 3, 6], [2, 7, 7], [12, 11, 11], [10, 4, 4], [9, 10, 10], [1, 2, 2], [4, 8, 8]];
var HighCard = [[1, 9, 13], [3, 6, 1], [12, 9, 10], [1, 6, 9], [10, 4, 2], [3, 8, 10], [13, 7, 4], [2, 10, 5], [1, 8, 11], [1, 7, 3], [6, 12, 2], [13, 10, 8], [1, 5, 9], [10, 5, 12], [13, 2, 4], [12, 7, 3], [1, 10, 4], [11, 8, 5]];


async function GT() {
   updateDoc(DocRef, {Today: Timestamp.now()});
    let Timerr = 55;
    for (let i = 0; i <= Timerr; i++) 
    {
        if(i == 0 || i == Timerr - 24)
        {
            updateDoc(DocRef, {
                BetAllowed: true,
                timerstart: true
            })
        }
        await sleepNow(1000)
        if(Timerr - i >= 30)
        {
            let kk=25 - i;
            updateDoc(DocRef, {
                timer: kk
            })
            if (kk == 7) {
                updateDoc(DocRef, {
                    timerstart: false,
                    BetAllowed: false
                })
            }
            else if (kk == 4) {
                GenCards();
            }
            else if (kk == 0) {
                updateDoc(DocRef, {
                    show:true
                })
                SetResults();
            }
        }
        else if(Timerr - i <= 25)
        {
            updateDoc(DocRef, {
                timer: Timerr - i
            })
            
            if (Timerr - i == 7) {
                updateDoc(DocRef, {
                    timerstart: false,
                    BetAllowed: false
                })
            }
            else if (Timerr - i == 4) {
                GenCards();
            }
            else if (Timerr - i == 0) {
                updateDoc(DocRef, {
                    
                    show:true
                })
                SetResults();
            }
        }
       

    }
}


 function SetResults()
{
    
    getDoc(DocRef).then((documentt) => {
        if (documentt.exists) {
            var NewDocs=documentt.data();
            console.log(NewDocs);
            if(NewDocs != null)
            {
                if(NewDocs.A1 != null && NewDocs.A2 != null && NewDocs.A3 != null && NewDocs.RoundNum != null)
                {
                    var Area=new Array();
                    var a1= NewDocs.A1;
                    var a2=NewDocs.A2;
                    var a3=NewDocs.A3;
                    Area.push(a1);
                    Area.push(a2);
                    Area.push(a3);
                    

                    var AR=0;

                    if(Area[0])
                    {
                        AR=1;
                    }
                    else if(Area[1])
                    {
                        AR=2;
                    }
                    else if(Area[2])
                    {
                        AR=3;
                    }

                    var RNum=documentt.data().RoundNum;
                    RNum++;
                    updateDoc(DocRef, {
                        RoundNum: RNum,
                    })
                    var s=RNum.toString()
                    const NewREF = doc(db, "SpinnerTimerBools", "TeenPatti","Results",s)
                    
                    setDoc(NewREF, {
                        Area: AR,
                        time:Timestamp.now()
                    })
                    updateDoc(DocRef, {
                        show: false,
                    })
                    SetServerPotValDefault();
                }
            }
            else
            {
                SetResults();
            } 
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

async function SetServerPotValDefault()
{
    await sleepNow(1000)
    updateDoc(DocRef, {
        PotA: 0,
        PotB: 0,
        PotC: 0,
        BetAllowed: false,
    })
}

async function GetActiveUsersCount()
{
    const NQ =  query(UssRef,where("LOG", "==", true))
    const querySnapshot = await getDocs(NQ);
    return querySnapshot.size;
}


function GenCards() {
    var Results = genTheCards();
    var Cards = Results[0];
    var TypeSeqs = Results[1];
    var P1 = new Array();
    var P2 = new Array();
    var P3 = new Array();
    var CardTypes = ["Trail", "Pure", "Colour", "Sequence", "Pair", "High"];

    for (let i = 0; i < 9; i++) {
        if (i < 3) {
            P1.push(Cards[i]);
        }
        else if (i >= 3 && i < 6) {
            P2.push(Cards[i]);
        }
        else if (i >= 6 && i < 9) {
            P3.push(Cards[i]);
        }
    }

    var OldCardBanner = new Array();
    var WinnerCardsBanner = new Array();
    var OldArea = [false, false, false];


    for (let j = 0; j < 3; j++) {
        WinnerCardsBanner.push(TypeSeqs[j]);
        for (let i = 0; i < 6; i++) {
            if (TypeSeqs[j] == i) {
                OldCardBanner.push(CardTypes[i]);
            }
        }
    }
    WinnerCardsBanner.sort(function(a, b){return a - b});

    for (let i = 0; i < 3; i++) {
        if (WinnerCardsBanner[0] == TypeSeqs[i]) {
            OldArea[i] = true;
        }
        else {
            OldArea[i] = false;
        }
    }
    
   

   

    getDoc(DocRef).then((doc) => {
        if (doc.exists) {

            var PotA = doc.data().PotA;
            var PotB = doc.data().PotB;
            var PotC = doc.data().PotC;

            var Pots = new Array();
            var UnsortedPots = new Array();
            var WinnedPot = 0;
            var Area = [false, false, false];
            Pots.push(PotA); Pots.push(PotB); Pots.push(PotC);
            UnsortedPots.push(PotA); UnsortedPots.push(PotB); UnsortedPots.push(PotC);

            Pots.sort(function(a, b){return a - b});
            if(Pots[0] == Pots[1] && Pots[0] == Pots[2])
                {
                    WinnedPot= GetRnNum(0, 3);
                    console.log("Same Bets");
                    for (let i = 0; i < 3; i++) {
                        if (i == WinnedPot) {
                            Area[i] = true;
                        }
                        else {
                            Area[i] = false;
                        }
                    }

                    var NewRes=new Array();
                    var NewCardBanner=new Array();

                    if(WinnedPot == 0)
                    {
                        if(OldArea[0])
                        {

                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[2]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }

                            }



                        }
                        else if(OldArea[1])
                        {
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[2]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }

                            }
                        }
                        else if(OldArea[2])
                        {
                            NewCardBanner.push(OldCardBanner[2]);
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[1]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }

                            }
                        }
                    }
                    else if(WinnedPot == 1)
                    {
                    if(OldArea[0])
                    {
                        NewCardBanner.push(OldCardBanner[1]);
                        NewCardBanner.push(OldCardBanner[0]);
                        NewCardBanner.push(OldCardBanner[2]);

                        for(let i=0;i<3;i++)
                        {
                            if(i==0)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P2[k]);
                                }
                            }
                            else if(i==1)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P1[k]);
                                }
                            }
                            else if(i==2)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P3[k]);
                                }
                            }

                        }
                    }
                    else if(OldArea[1])
                    {
                        NewCardBanner.push(OldCardBanner[0]);
                        NewCardBanner.push(OldCardBanner[1]);
                        NewCardBanner.push(OldCardBanner[2]);

                        for(let i=0;i<3;i++)
                        {
                            if(i==0)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P1[k]);
                                }
                            }
                            else if(i==1)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P2[k]);
                                }
                            }
                            else if(i==2)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P3[k]);
                                }
                            }

                        }
                    }
                    else if(OldArea[2])
                    {
                        NewCardBanner.push(OldCardBanner[0]);
                        NewCardBanner.push(OldCardBanner[2]);
                        NewCardBanner.push(OldCardBanner[1]);

                        for(let i=0;i<3;i++)
                        {
                            if(i==0)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P1[k]);
                                }
                            }
                            else if(i==1)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P3[k]);
                                }
                            }
                            else if(i==2)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P2[k]);
                                }
                            }

                        }
                    }
                    }
                    else if(WinnedPot == 2)
                    {
                        if(OldArea[0])
                        {
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[2]);
                            NewCardBanner.push(OldCardBanner[0]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }

                            }
                        }
                        else if(OldArea[1])
                        {
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[2]);
                            NewCardBanner.push(OldCardBanner[1]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }

                            }
                        }
                        else if(OldArea[2])
                        {
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[2]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }

                            }
                        }
                    }

                    updateDoc(DocRef, {
                        cards: NewRes,
                        C11:NewCardBanner[0],
                        C22:NewCardBanner[1],
                        C33:NewCardBanner[2],
                        A1:Area[0],
                        A2:Area[1],
                        A3:Area[2]
                    })
                }
                else
                {
                   // WinnedPot= TestVN(Pots,UnsortedPots).then();
                   GetActiveUsersCount().then((val)=> {
                    if(val==1)
                    {
                        console.log("Single Player");
                         WinnedPot= GetRnNum(0, 3);
                    }
                    else
                    {
                        console.log("Normal");
                         for (let i = 0; i < 3; i++) {
                     
                             if (Pots[0] == UnsortedPots[i]) {
             
                                 WinnedPot = i;
                                 break;
                             }
                         }
                    }
                            
                    for (let i = 0; i < 3; i++) {
                        if (i == WinnedPot) {
                            Area[i] = true;
                        }
                        else {
                            Area[i] = false;
                        }
                    }

                    var NewRes=new Array();
                    var NewCardBanner=new Array();

                    if(WinnedPot == 0)
                    {
                        if(OldArea[0])
                        {

                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[2]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }

                            }



                        }
                        else if(OldArea[1])
                        {
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[2]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }

                            }
                        }
                        else if(OldArea[2])
                        {
                            NewCardBanner.push(OldCardBanner[2]);
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[1]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }

                            }
                        }
                    }
                    else if(WinnedPot == 1)
                    {
                    if(OldArea[0])
                    {
                        NewCardBanner.push(OldCardBanner[1]);
                        NewCardBanner.push(OldCardBanner[0]);
                        NewCardBanner.push(OldCardBanner[2]);

                        for(let i=0;i<3;i++)
                        {
                            if(i==0)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P2[k]);
                                }
                            }
                            else if(i==1)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P1[k]);
                                }
                            }
                            else if(i==2)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P3[k]);
                                }
                            }

                        }
                    }
                    else if(OldArea[1])
                    {
                        NewCardBanner.push(OldCardBanner[0]);
                        NewCardBanner.push(OldCardBanner[1]);
                        NewCardBanner.push(OldCardBanner[2]);

                        for(let i=0;i<3;i++)
                        {
                            if(i==0)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P1[k]);
                                }
                            }
                            else if(i==1)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P2[k]);
                                }
                            }
                            else if(i==2)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P3[k]);
                                }
                            }

                        }
                    }
                    else if(OldArea[2])
                    {
                        NewCardBanner.push(OldCardBanner[0]);
                        NewCardBanner.push(OldCardBanner[2]);
                        NewCardBanner.push(OldCardBanner[1]);

                        for(let i=0;i<3;i++)
                        {
                            if(i==0)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P1[k]);
                                }
                            }
                            else if(i==1)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P3[k]);
                                }
                            }
                            else if(i==2)
                            {
                                for(let k=0;k<3;k++)
                                {
                                    NewRes.push(P2[k]);
                                }
                            }

                        }
                    }
                    }
                    else if(WinnedPot == 2)
                    {
                        if(OldArea[0])
                        {
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[2]);
                            NewCardBanner.push(OldCardBanner[0]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }

                            }
                        }
                        else if(OldArea[1])
                        {
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[2]);
                            NewCardBanner.push(OldCardBanner[1]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }

                            }
                        }
                        else if(OldArea[2])
                        {
                            NewCardBanner.push(OldCardBanner[0]);
                            NewCardBanner.push(OldCardBanner[1]);
                            NewCardBanner.push(OldCardBanner[2]);

                            for(let i=0;i<3;i++)
                            {
                                if(i==0)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P1[k]);
                                    }
                                }
                                else if(i==1)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P2[k]);
                                    }
                                }
                                else if(i==2)
                                {
                                    for(let k=0;k<3;k++)
                                    {
                                        NewRes.push(P3[k]);
                                    }
                                }

                            }
                        }
                    }

                    updateDoc(DocRef, {
                        cards: NewRes,
                        C11:NewCardBanner[0],
                        C22:NewCardBanner[1],
                        C33:NewCardBanner[2],
                        A1:Area[0],
                        A2:Area[1],
                        A3:Area[2]
                        })
                    }); 
                }

                console.log(Pots);

            

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

}


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {

        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));

        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function genTheCards() {
    let kk = 0;
    var ChoseCard = [Trail, Pure, Colorss, Sequence, Pair, HighCard];
    var Typer = [0, 1, 2, 3, 4, 5];
    var Typ = new Array();

    //   for(let i=0;i<Typer.length;i++)
    //     {
    //         Typ.push(Typer[i]);
    //     }
    Typ = shuffleArray(Typer);

    Typ = shuffleArray(Typ);
    kk = Typ[0];
    Typ.shift();
    let Tseq1 = kk;

    Typ = shuffleArray(Typ);
    kk = Typ[0];
    Typ.shift();
    let Tseq2 = kk;

    Typ = shuffleArray(Typ);
    kk = Typ[0];
    Typ.shift();
    let Tseq3 = kk;

    Typ = shuffleArray(Typer);

    let SuiteIndx = GetRnNum(1, 3);

    var TDeck = new Array();
    var r1 = SetAllCards(TDeck, ChoseCard, Tseq1, Tseq2, Tseq3, SuiteIndx);
    var Ty = new Array();
    Ty.push(Tseq1); Ty.push(Tseq2); Ty.push(Tseq3);

    var Result = new Array();
    Result.push(r1); Result.push(Ty);

    return Result;
}
function GetRnNum(min, max) {
    return Math.floor((Math.random() * max) + min);

}



function SetAllCards(TMDeck, ChoseCard, TypeSequence1, TypeSequence2, TypeSequence3, SuiteIndx) {
    var SelectedCardType1 = ChoseCard[TypeSequence1];
    var SelectedCardType2 = ChoseCard[TypeSequence2];
    var SelectedCardType3 = ChoseCard[TypeSequence3];

    let Ranindex1 = GetRnNum(0, SelectedCardType1.length - 1);
    var C1 = SelectedCardType1[Ranindex1];

    let Ranindex2 = GetRnNum(0, SelectedCardType2.length - 1);
    var C2 = SelectedCardType2[Ranindex2];

    let Ranindex3 = GetRnNum(0, SelectedCardType3.length - 1);
    var C3 = SelectedCardType3[Ranindex3];

    ChangeCard(TMDeck, C1, TypeSequence1, SuiteIndx);

    if (ChangeCard(TMDeck, C2, TypeSequence2, SuiteIndx)) {
        if (ChangeCard(TMDeck, C3, TypeSequence3, SuiteIndx)) {
            return TMDeck;
        }
        else {
            return Set3Cards(TMDeck, ChoseCard, TypeSequence3, SuiteIndx);
        }
    }
    else {
        return Set6Cards(TMDeck, ChoseCard, TypeSequence2, TypeSequence3, SuiteIndx);
    }
}


function Set6Cards(TMDeck, ChoseCard, TypeSequence2, TypeSequence3, SuiteIndx) {
    var SelectedCardType2 = ChoseCard[TypeSequence2];
    var SelectedCardType3 = ChoseCard[TypeSequence3];
    let Ranindex2 = GetRnNum(0, SelectedCardType2.length - 1);
    var C2 = SelectedCardType2[Ranindex2];

    let Ranindex3 = GetRnNum(0, SelectedCardType3.length - 1);
    var C3 = SelectedCardType3[Ranindex3];

    if (ChangeCard(TMDeck, C2, TypeSequence2, SuiteIndx)) {
        if (ChangeCard(TMDeck, C3, TypeSequence3, SuiteIndx)) {
            return TMDeck;
        }
        else {
            return Set3Cards(TMDeck, ChoseCard, TypeSequence3, SuiteIndx);
        }
    }
    else {
        return Set6Cards(TMDeck, ChoseCard, TypeSequence2, TypeSequence3, SuiteIndx);
    }
}


function Set3Cards(TMDeck, ChoseCard, TypeSequence3, SuiteIndx) {
    var SelectedCardType3 = ChoseCard[TypeSequence3];
    let Ranindex3 = GetRnNum(0, SelectedCardType3.length - 1);

    var C3 = SelectedCardType3[Ranindex3];

    if (ChangeCard(TMDeck, C3, TypeSequence3, SuiteIndx)) {
        return TMDeck;
    }
    else {
        return Set3Cards(TMDeck, ChoseCard, TypeSequence3, SuiteIndx);
    }
}

function ChangeCard(TMDeck, C, TypeSequence, SuiteIndx) {
    let j = [0, 1, 2, 3];

    var jk = new Array();
    for (let i = 0; i < j.length; i++) {
        jk.push(j[i]);
    }
    var CK = new Array();
    for (let i = 0; i < C.length; i++) {
        let kk;
        if (TypeSequence == 1 || TypeSequence == 3) {
            kk = SuiteIndx - 1;
            CK.push(C[i] - 1 + (13 * kk));

        }
        else {
            jk = shuffleArray(jk);
            kk = jk[0];

            jk.shift();
            CK.push(C[i] - 1 + (13 * kk));

        }


    }
    if (!TMDeck.includes(CK[0]) && !TMDeck.includes(CK[1]) && !TMDeck.includes(CK[2])) {
        for (let i = 0; i < CK.length; i++) {
            TMDeck.push(CK[i]);
        }

        return true;
    }
    else {
        //print("Not Added to Deck");
        return false;
    }


}
