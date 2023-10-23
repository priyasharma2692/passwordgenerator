let inputslider=document.querySelector("[data-lengthSlider]");
let lengthdisplay=document.querySelector("[data-lengthnumber]");
let passworddisplay=document.querySelector("[data-passwordDisplay]");
let copybutton=document.querySelector("[data-copy]");
let copymsg=document.querySelector("[data-copyMsg]");
let upparcasecheck=document.querySelector("#uppercase");
let lowercasecheck=document.querySelector("#lowercase");
let numberscheck=document.querySelector("#numbers");
let symbolscheck=document.querySelector("#symbols");
let indicator=document.querySelector("[data-indicator]");
let generatebtn=document.querySelector(".generateButton");
let allcheckbox=document.querySelectorAll("input[type=checkbox]");

const symbols="`~!@$%^&*(){}[]:;'/?,<.>";
let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();
setIndicator("#ccc");

//shuffle function
function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length - 1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp= array[i];
        array[i]=array[j];
        array[j]=temp;

    }
    let str="";
    array.forEach((el)=>(str += el));
    return str;
}
// set strength circle color to grey


function handleSlider()
{
   
   inputslider.value=passwordLength;
   lengthdisplay.innerText=passwordLength;
   const min=inputslider.min;
   const max=inputslider.max;

   inputslider.style.backgroundSize =((passwordLength - min)*100/(max - min)) + "% 100%";
   
}


function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`1px 1px 12px 1px ${color}`;

}


function getRandomInteger(min,max)
{
   return Math.floor(Math.random() *(max-min)) + min;
}

function generateRandomNumber()
{
    return getRandomInteger(0,9);
}
function generateLowerCase()
{
    return String.fromCharCode(getRandomInteger(97,123))
}
function generateUpperCase()
{
    return String.fromCharCode(getRandomInteger(65,91))
}
function generateSymbol()
{
    const random=getRandomInteger(0, symbols.length);
    return symbols.charAt(random);
}

//function  to calculate strength of password
function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymbol=false;

    if(upparcasecheck.checked) hasUpper=true;
    if(lowercasecheck.checked) hasLower=true;
    if(numberscheck.checked) hasNum=true;
    if(symbolscheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower ||hasUpper) && (hasNum || hasSymbol) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

// function to copy password to clipboard
 async function copyContent(){
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="copied";
    }
    catch{
        copymsg.innerText="failed";
    }

    //to make copy span visible
    copymsg.classList.add("active");
    setTimeout( ()=>{
        copymsg.classList.remove("active");
    },2000);
   
}

function handleCheckBoxChange()
{
    checkCount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    })
    //special condition
    if(passwordLength <checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}

allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
inputslider.addEventListener('input', (e) =>{
    passwordLength=e.target.value;
    handleSlider();

})

copybutton.addEventListener('click',()=>
{
    if(passworddisplay.value)
    copyContent();

})


generatebtn.addEventListener('click',()=>{
    
 //none of the checkbox are selecred
 if(checkCount ==0) 
 return;

 if(passwordLength < checkCount){
    passwordLength=checkCount;
    handleSlider();
 }
 //genearte new password
 //empty old password
 password="";
 



let funArr=[];

if (upparcasecheck.checked)
funArr.push(generateUpperCase);

if (lowercasecheck.checked)
funArr.push(generateLowerCase);

if (numberscheck.checked)
funArr.push(generateRandomNumber);

if (symbolscheck.checked)
funArr.push(generateSymbol);


//compulsory addition

for(let i=0;i<funArr.length;i++)
{
    password +=funArr[i]();
}


//reamining addition
for(let i=0; i< passwordLength-(funArr.length);i++)
{
    let randIndex = getRandomInteger(0, (funArr.length));
    console.log(randIndex);
    password += funArr[randIndex]();
}

   // shuffle password
password = shufflePassword(Array.from(password));


passworddisplay.value=password;

   //calculate strength
calcStrength();

})