var data = new Object;
var datatable; 
var db = openDatabase('MyData', '', 'test Database', 102400);
function window_onload()
{
    datatable= document.getElementById("datatable");
    showAllData(true);
}
function tbxNum_onblur()
{
    var num,price;
    num=parseInt(document.getElementById("tbxNum").value);
    price=parseFloat(document.getElementById("tbxPrice").value);
    if (isNaN(num*price))
    {
        document.getElementById("tbxNum").value="0";
        document.getElementById("tbxMoney").value="0";
    }
    else
        document.getElementById("tbxMoney").value= num * price;
}

function tbxPrice_onblur()
{
    var num,price;
    num=parseInt(document.getElementById("tbxNum").value);
    price=parseFloat(document.getElementById("tbxPrice").value);
    
    if (isNaN(num*price))
    {
        document.getElementById("tbxPrice").value="0";
        document.getElementById("tbxMoney").value="0";
    }
    else
        document.getElementById("tbxMoney").value= num * price;
}
function btnAdd_onclick()
{
    data.Code=document.getElementById("tbxCode").value;
    data.Date=document.getElementById("tbxDate").value;
    data.GoodsCode=document.getElementById("tbxGoodsCode").value;
    data.BrandName=document.getElementById("tbxBrandName").value;
    data.Num=document.getElementById("tbxNum").value;
    data.Price=document.getElementById("tbxPrice").value;
    data.PersonName=document.getElementById("tbxPersonName").value;
    data.Email=document.getElementById("tbxEmail").value;
    db.transaction(function(tx) 
    {   
        tx.executeSql('SELECT * FROM orders where code=?', [data.Code], function(tx, rs) 
        {  
            if(rs.rows.length>0)         
            {
                alert("输入的订单编号在数据库中已存在!");
                return;
            }
            tx.executeSql('INSERT INTO orders VALUES(?,?,?,?,?,?,?,?)',
            [data.Code,data.Date,data.GoodsCode,data.BrandName,data.Num,data.Price,data.PersonName,data.Email],  
            function(tx, rs) 
            {  
                alert("成功保存数据!");
                showAllData(false); 
                btnNew_onclick(); 
            },  
            function(tx, error) 
            {  
                alert(error.source + "::" + error.message);  
            });  
        },
        function(tx, error) 
        {  
            alert(error.source + "::" + error.message);  
        });  
    });
    
}
function btnUpdate_onclick()
{
    data.Code=document.getElementById("tbxCode").value;
    data.Date=document.getElementById("tbxDate").value;
    data.GoodsCode=document.getElementById("tbxGoodsCode").value;
    data.BrandName=document.getElementById("tbxBrandName").value;
    data.Num=document.getElementById("tbxNum").value;
    data.Price=document.getElementById("tbxPrice").value;
    data.PersonName=document.getElementById("tbxPersonName").value;
    data.Email=document.getElementById("tbxEmail").value;
    db.transaction(function(tx) 
    {  
        tx.executeSql('update orders set date=?,goodscode=?,brandName=?,num=?,price=?,personName=?,email=? where code=?',[data.Date,data.GoodsCode,data.BrandName,data.Num,data.Price,data.PersonName,data.Email,data.Code],  
        function(tx, rs) 
        {  
            alert("成功修改数据!");
            showAllData(false);  
        },  
        function(tx, error) 
        {  
            alert(error.source + "::" + error.message);  
        });  
    });   
}
function btnDelete_onclick()
{
    data.Code=document.getElementById("tbxCode").value;
    db.transaction(function(tx) 
    {  
        tx.executeSql('delete from orders where code=?',[data.Code],  
        function(tx, rs) 
        {  
            alert("成功删除数据!");
            showAllData(false);  
            btnNew_onclick(); 
        },  
        function(tx, error) 
        {  
            alert(error.source + "::" + error.message);  
        });  
    });    
}
function btnNew_onclick()
{
    document.getElementById("form1").reset();
    document.getElementById("tbxCode").removeAttribute("readonly");
    document.getElementById("btnAdd").disabled="";
    document.getElementById("btnUpdate").disabled="disabled";
    document.getElementById("btnDelete").disabled="disabled";
}
function btnClear_onclick()
{
    document.getElementById("tbxDate").value="";
    document.getElementById("tbxGoodsCode").value="";      
    document.getElementById("tbxBrandName").value="";
    document.getElementById("tbxNum").value="0";
    document.getElementById("tbxPrice").value="0";
    document.getElementById("tbxMoney").value="0";
    document.getElementById("tbxPersonName").value="";
    document.getElementById("tbxEmail").value="";
}
function tr_onclick(tr,i)
{
    document.getElementById("tbxCode").value=tr.children.item(0).innerHTML;
    document.getElementById("tbxDate").value=tr.children.item(1).innerHTML;
    document.getElementById("tbxGoodsCode").value=tr.children.item(2).innerHTML;      
    document.getElementById("tbxBrandName").value=tr.children.item(3).innerHTML;
    document.getElementById("tbxNum").value=tr.children.item(4).innerHTML;
    document.getElementById("tbxPrice").value=tr.children.item(5).innerHTML;
    document.getElementById("tbxMoney").value=tr.children.item(6).innerHTML;
    document.getElementById("tbxPersonName").value=tr.children.item(7).innerHTML;
    document.getElementById("tbxEmail").value=tr.children.item(8).innerHTML;
    document.getElementById("tbxCode").setAttribute("readonly",true);
    document.getElementById("btnAdd").disabled="disabled";
    document.getElementById("btnUpdate").disabled="";
    document.getElementById("btnDelete").disabled="";
}
function showAllData(loadPage) 
{  

    db.transaction(function(tx) 
    {  
        tx.executeSql('CREATE TABLE IF NOT EXISTS orders(code TEXT, date TEXT,goodscode TEXT,brandName TEXT,num INTEGER,price FLOAT,personName TEXT,email TEXT)',[]); 
        tx.executeSql('SELECT * FROM orders ', [], function(tx, rs) 
        {  
            if(!loadPage)         
                removeAllData(); 
            for(var i = 0; i < rs.rows.length; i++) 
            {               
                showData(rs.rows.item(i),i);  
            }  
        },
        function(tx, error) 
        {  
            alert(error.source + "::" + error.message);  
        });  
    });   
}
function removeAllData()
{  
    for (var i =datatable.childNodes.length-1; i>1; i--) 
        datatable.removeChild(datatable.childNodes[i]);  
}  
function showData(row,i) 
{ 
    var tr = document.createElement('tr');
    tr.setAttribute("onclick","tr_onclick(this,"+i+")");
    var td1 = document.createElement('td');  
    td1.innerHTML = row.code;  
    var td2 = document.createElement('td');  
    td2.innerHTML = row.date;  
    var td3 = document.createElement('td');  
    td3.innerHTML = row.goodscode;   
    var td4 = document.createElement('td');  
    td4.innerHTML = row.brandName; 
    var td5 = document.createElement('td');  
    td5.innerHTML = row.num; 
    var td6 = document.createElement('td');  
    td6.innerHTML = row.price; 
    var td7 = document.createElement('td');  
    td7.innerHTML = parseInt(row.num)*parseFloat(row.price); 
    var td8 = document.createElement('td');  
    td8.innerHTML = row.personName; 
    var td9= document.createElement('td');  
    td9.innerHTML = row.email; 
    tr.appendChild(td1);  
    tr.appendChild(td2);  
    tr.appendChild(td3);  
    tr.appendChild(td4); 
    tr.appendChild(td5); 
    tr.appendChild(td6); 
    tr.appendChild(td7); 
    tr.appendChild(td8);
    tr.appendChild(td9);
    datatable.appendChild(tr);
}  