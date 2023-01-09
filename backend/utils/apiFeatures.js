const { json } = require("express");

class APIfeatures{
    constructor(query,queryStr){
        this.query=query,
        this.queryStr=queryStr
    }
    Search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}
        console.log(keyword);

        this.query=this.query.find({...keyword})
        return this;
    }

    Filter(){
        const queryCopy={...this.queryStr}


        //Removing fields from query
        const removefilds=['keyword', 'limit','page'];
        removefilds.forEach(field=>{
            delete queryCopy[field]});
            console.log(queryCopy);



            //Filter for price ,ratind and etc..

            let queryStr=JSON.stringify(queryCopy);
            queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`);
            
            console.log(queryStr);

            this.query=this.query.find(JSON.parse(queryStr));

            return this;
    }

    Pagination(resPerPage){
        const curruntPage=Number(this.queryStr.page)||1;
        const skip=resPerPage*(curruntPage-1);
        this.query=this.query.limit(resPerPage).skip(skip);
        return this;


    }
}


module.exports=APIfeatures;