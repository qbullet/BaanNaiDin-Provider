const express = require('express')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 5000

const itemsFromDB = [
    { ID: '1001', name: 'Harry Potter : Philosopher\'s stone', price: 100 },
    { ID: '1002', name: 'Harry Potter : Chamber of Secrets', price: 100 },
    { ID: '1003', name: 'Harry Potter : Prisoner of Azkaban', price: 100 },
    { ID: '1004', name: 'Harry Potter : Goblet of Fire', price: 100 },
    { ID: '1005', name: 'Harry Potter : Order of the Phoenix', price: 100 },
    { ID: '1006', name: 'Harry Potter : Half-Blood Prince', price: 100 },
    { ID: '1007', name: 'Harry Potter : Dealthy Hallows', price: 100 },
]

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send({
        ok: "true"
    })
})

app.post('/confirm-orders', (req, res) => {
    res.header("Access-Control-Allow-Origin","*")

    let {data} = req.body

    let promoted = promoting(data)
    let result = calcTotal(promoted.promo)
    
    res.send({
        "res":{
            "price":result.total,
            "discount":result.allDiscount,
            "totalBook":promoted.totalBook
        }
    })
})

promoting = (data) => {

    let stack = data
    let ct,totalBook = 0;
    let promo = []
    
    stack.sort((less,greater)=>greater.amount - less.amount)
    while(stack.length > 0){
        ct = 0
        stack.forEach((element,index) => {
            if(element.amount > 0){
                ct++
                totalBook++
                element.amount--
            }
            else if(element.amount == 0){
                stack.splice(index,1)
            }
            else{
                console.log('something wrong')
            }
        });
        promo.push(ct)
    }
    for(let i = 0;i<promo.length;i++){
        if(promo[i] == 0){
            promo.splice(i,1)
            i = 0
        }
    }
    //console.log(promo)
    return{promo,totalBook}
}

calcTotal = (promoted) => {
    let discount = [0,0,10,20,30,40,50,60]
    
    let total = 0
    let discounted,allDiscount = 0
    promoted.forEach(element => {
        discounted = ((element*100)*discount[element]/100)
        allDiscount += discounted
        total += (element*100)-discounted
    });
    return {total,allDiscount}
    
}

// calcPrice = (data) => {
//     let total = []
//     let discount = [0,0,10,20,30,40,50,60]
//     data.forEach(element => {
//         let tempTotal = 0
//         element.forEach(ID => {
//             let temp = extendInfo(ID)
//             //console.log('temp 0 : ',temp)
//             tempTotal += temp[0].price
//         });
//         tempTotal = tempTotal - (tempTotal*discount[element.length]/100)
//         total.push(tempTotal)
//     });
//     console.log(total)
//     return total
// }

extendInfo = (ID) => {
    let data = itemsFromDB.filter(
        item => item.ID === ID
    )
    //console.log(data)
    return data
}

app.listen(port, () => {
    console.log(`Baan Nai Din\'server is running on localhost:${port}`)
})