const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");


const app=express();
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

const itemSchema={
    name:String
}
const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name:"welcome to our todolist"
});

const item2=new Item({
    name:"hit the + sign to add new todolist"
});

const item3=new Item({
    name:"<-- press this button to delete item"
});

const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemSchema]
};

const List=mongoose.model("List",listSchema);

/*Item.insertMany(defaultItems)
.then((val)=>{console.log("succesfull");})
.catch((err)=>{console.log(err);})

*/
app.get("/",function(req,res){
  Item.find({})

  .then((val)=>{
    if(val.length===0){
        Item.insertMany(defaultItems)
.then((val)=>{console.log("succesfull");})
.catch((err)=>{console.log(err);})
   res.redirect("/");
    }
    else{
        res.render("list",{listTitle:"Today",newlistitem:val});
    }
  })
});

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);

    List.findOne({name:customListName})
    .then((val)=>{
        if(val){res.render("list",{listTitle:val.name,newlistitem:val.items})}
        else{ const list=new List({
            name:customListName,
            items:defaultItems
        });
        
        list.save();
        res.redirect("/customListName");}
    })
    const list=new List({
        name:customListName,
        items:defaultItems
    });
    
    list.save();
})

app.post("/",function(req,res){
   
    let itemname=req.body.newItem;
    const listname=req.body.list;

    const item=new Item({
    name:itemname
   });

   if(listname==="Today"){ item.save();
    res.redirect("/");}
   else{
    List.findOne({name:listname})
    .then((foundlist)=>{foundlist.items.push(item);
    foundlist.save();
res.redirect("/"+listname)})
   }
});

app.post("/delete",function(req,res){
   const checkedItemId=req.body.checkbox;
   const listName=req.body.listName;

if(listName==="Today"){
    Item.findByIdAndDelete(checkedItemId)
.then((val)=>{console.log("successfully deleted checked item");
res.redirect("/")})

.catch((err)=>{console.log("errror");})
}

else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
    .then(()=>{res.redirect("/"+listName);})
}
})


app.listen(3000,function(){
    console.log("server started on port:3000");
});

app.get("/work",function(req,res){
    res.render("list",{listTitle:"work list",newlistitem:workitem})
});

app.get("/about",function(req,res){
    res.render("about");
});

app.post("/work",function(req,res){
    let item=req.body.newItem;
    workitem.push(item);
    res.redirect("/work");
})