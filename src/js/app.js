App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  pharmaFlag: 0,

  init: async function() {
    console.log("Entered init function");
    return await App.initWeb3();
  },

  initWeb3: async function() {
    console.log("Entered initWeb3 function");
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    console.log("Entered initContract function");
    $.getJSON("Manufacturer.json", function(Manufacturer) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Manufacturer = TruffleContract(Manufacturer);
      // Connect provider to interact with contract
      App.contracts.Manufacturer.setProvider(App.web3Provider);
    });

    $.getJSON("Pharma.json", function(Pharma) {
      App.contracts.Pharma = TruffleContract(Pharma);
      App.contracts.Pharma.setProvider(App.web3Provider);
    });

    $.getJSON("Warehouse.json", function(Warehouse) {
      App.contracts.Warehouse = TruffleContract(Warehouse);
      App.contracts.Warehouse.setProvider(App.web3Provider);
    });

    $.getJSON("Wholesaler.json", function(Wholesaler) {
      App.contracts.Wholesaler = TruffleContract(Wholesaler);
      App.contracts.Wholesaler.setProvider(App.web3Provider);
    });

    $.getJSON("Register.json", function(Register) {
      App.contracts.Register = TruffleContract(Register);
      App.contracts.Register.setProvider(App.web3Provider);
    });
    
    return App.render(); 
  },

  render: function(){
    console.log("Entered render function");
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        console.log(account);
      }
    });
    console.log("EnD of render function");
  },

  register: function(){
    console.log("Entered register");
    //console.log(App.contracts.Register);
    App.contracts.Register.deployed().then(function(instance){
     console.log(instance);
     instance.register($("#username").val(),$("#password").val(),$("#email").val(),$("#dropdown").val()).then(function(res){
        console.log(res);
        alert("Account: "+ App.account);
        window.location.href = "index.html";
     }).catch(function(err){
      alert(App.account + " is already registered under a different username");
     });
    }).catch(function(err){
        console.log(err);
    });
  },
  //working
  addBatch: function(){

    console.log("entered addBatch function");
    let mDate =  (new Date($("#manufacturingDate").val())).getTime();
    let eDate = (new Date($("#ExpirationDate").val())).getTime();
    App.contracts.Manufacturer.deployed().then(function(instance){
      console.log(typeof($("#manufactureraddress").val())+" "+
        //typeof($("#manufactureraddress").val())+ " " +
        typeof(eDate/1000)+ " " +
        typeof(eDate/1000)+ " " +
        typeof($("#noOfUnits").val())+" "+
        typeof($("#pricePerUnit").val())+ " " +
        typeof($("#description").val())+ " " +
        typeof($("#supplier").val())+ " " +
        typeof($("#composition").val()));
      instance.createBatch($("#manufactureraddress").val(),
        mDate/1000,
        eDate/1000,
        $("#noOfUnits").val(),
        $("#pricePerUnit").val(),
        $("#description").val(),
        $("#supplier").val(),
        $("#composition").val()).then(function(res){
        alert("Batch created successfully");
      }).catch(function(err){
        console.log( "error: "+ JSON.stringify(err));
      });
    }).catch(function(err){
      console.log("err" + err);
    });
  },
  
  addtoWarehouse: function(){
    let incomingDate =  (new Date($("#incoming_date").val())).getTime();
    let outgoingDate = (new Date($("#outgoing_date").val())).getTime();
    console.log(typeof(incomingDate) + outgoingDate);
    console.log("entered addtowarehouse function");
    App.contracts.Warehouse.deployed().then(function(instance){
      console.log(instance);
      instance.addToWarehouse($("#warehouse_batch_id").val(),$("#warehouse_updated_price").val(),$("#warehouse_location").val(),$("#warehouse_name").val(),$("#warehouse_capacity").val(),incomingDate/1000,outgoingDate/1000, { from: App.account }).then(function(res){
        alert("Added to warehouse successfully");
      }).catch(function(err){
        console.log(err);
      });
    }).catch(function(err){
      console.log(err);
    });
  },

  wholesaler: function(){
    console.log("entered wholesaler function");
    let incomingDate =  (new Date($("#wholesaler_incoming_date").val())).getTime();
    let outgoingDate = (new Date($("#wholesaler_outgoing_date").val())).getTime();
    App.contracts.Wholesaler.deployed().then(function(instance){
      instance.add_Wholesaler($("#wholesaler_batch_id").val(),incomingDate/1000,outgoingDate/1000,$("#wholesaler_updated_price").val(), $("#wholesaler_status").val()).then(function(instance){
        alert("successful transaction");
      }).catch(function(err){
        console.log(err);
      });
    }).catch(function(err){
      console.log(err);
    });
  },

  pharma: function(){
    console.log("Entered pharma function:");
    if(App.pharmaFlag == 0){
      var ManufacturerInstance;
      App.contracts.Manufacturer.deployed().then(function(instance){
        ManufacturerInstance = instance;
        App.contracts.Pharma.deployed().then(function(instance){
          console.log("giving instance");
          instance.giveInstance(ManufacturerInstance.contract.address).then(function(res){
            pharmaFlag = 1;
          }).catch(function(err){
            console.log(err);
          });
        }).catch(function(err){
          console.log(err);
        });
      }).catch(function(err){
        console.log(err);
      });
    }
    App.contracts.Pharma.deployed().then(function(instance){
      console.log("entered createlot part")
      instance.creatLot($("#chemist_quantity").val(),$("#chemist_batch_id").val(),$("#chemist_updated_price").val()).then(function(res){
        if(res == true){
          alert("Created lot successfully");
        }
      }).catch(function(err){
        console.log(err);
      });
    }).catch(function(err){
      console.log(err);
    });
  },
  //we need to get the batch id first and then do it
  retrieve: function(){
    App.contracts.Manufacturer.deployed().then(function(instance){
      //here
      instance.batches(1).then(function(res){
        console.log("manufacturer : " + res);
        var manu_address = res[1];
        var manu_date = res[2];
        var exp_date = res[3];
        var nou = res[4];
        var ppu = res[5];
        var des = res[6];
        var supp = res[7];
        var comp = res[8];

        var x =  "<div> <p>Manufacture address :" + manu_address +"manu_date" + manu_date +"exp date : " +exp_date+" nnu: "+nou+"ppu: "+ppu + "des : "+des+"supp: " +supp +"comp : " + comp +"</p></div>";
        $("#manufacturer_timeline").append(x);
      }).catch(function(err){
        console.log(err);
      });
    }).catch(function(err){
      console.log("manufacturer : " + err);
    });

    App.contracts.Warehouse.deployed().then(function(instance){
      //here
      instance.warehouses(1).then(function(res){
        console.log("warehouses : " + res);
      }).catch(function(err){
        console.log(err);
      });
    }).catch(function(err){
      console.log("warehouses : " + err);
    });

    App.contracts.Wholesaler.deployed().then(function(instance){
      //here
      instance.wholesalers(1).then(function(res){
        console.log("wholesalers : " + res);
      }).catch(function(err){
        console.log(err);
      });
    }).catch(function(err){
      console.log("wholesalers : " + err);
    });

    // App.contracts.Pharma.deployed().then(function(instance){
    //   //here
    //   instance.Lots(1).then(function(res){
    //     console.log("pharma : " + res);
    //   }).catch(function(err){
    //     console.log(err);
    //   });
    // }).catch(function(err){
    //   console.log("pharma : " + err);
    // });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

/*
bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
   App.contracts.adoption.deployed().then(function(instance){
     return instance.getAdopters.call();
   }).then(function(adopters){
     for(let i = 0 ; i < adopters.length;i++){
       if(!web3.toBigNumber(adopters[i].isZero())){
         $('.panel-pet').eq(i).find("button").text("Success").attr("disabled", true);
       }
     }
   }).catch(function(error){
     console.log(error.message);
   });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    
    web3.eth.getAccounts(function(error,accounts){
      if(error){
        console.log(error);
      }

      App.contracts.adoption.deployed().then(function(instance){
        return instance.adopt.sendTransaction(petId,{from: accounts[0]})
      }).then(function(result){
        return App.markAdopted();
      }).catch(function(error){
        console.log(error.message);
      });
    });
  }

*/


