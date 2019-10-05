App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  pharma: 0,

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
  //remaining
  addBatch: function(){

    console.log("entered addBatch function");
    
    App.contracts.Manufacturer.deployed().then(function(instance){
      console.log(typeof($("#description").val()))
      instance.createBatch($("#medicineName").val(),
        $("#manufactureraddress").val(),
        //$("#manufacturingDate").val(),
        10,
        //$("#ExpirationDate").val(),
        20,
        $("#noOfUnit").val(),
        $("#pricePerUnit").val(),
        $("#description").val(),
        $("#supplier").val(),
        $("#composition").val(),
        //range,
        $("#status").val()).then(function(res){
        alert("Batch created successfully");
      }).catch(function(err){
        console.log( "error: "+ err);
      });
    }).catch(function(err){
      console.log("err" + err);
    });
  },
  //remaining just add values
  addToWarehouse: function(){
    console.log("entered addtowarehouse function");
    App.contracts.Warehouse.deployed().then(function(instance){
      instance.addToWarehouse($().val(),$().val(),$().val(),$().val(),$().val(),$().val(),$().val()).then(function(res){
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
    App.contracts.Wholesaler.deployed().then(function(instance){
      instance.add_Wholesaler($().val(),$().val(),$().val(),$().val()).then(function(instance){
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
    if(App.pharma == 0){
      var ManufacturerInstance;
      App.contracts.Manufacturer.deployed().then(function(instance){
        ManufacturerInstance = instance;
        App.contracts.Pharma.deployed().then(function(instance){
          console.log("giving instance");
          instance.giveInstance(ManufacturerInstance.contract.address).then(function(res){
          }).catch(function(err){
            console.log(err);
          });
        }).catch(function(err){
          console.log(err);
        });
      }).catch(function(err){
        console.log(err);
      });
    }else{
      App.contracts.Pharma.deployed().then(function(instance){
        instance.creatLot($().val(),$().val(),$().val()).then(function(res){
          alert("Created lot successfully");
        }).catch(function(err){
          console.log(err);
        });
      }).catch(function(err){
        console.log(err);
      });
    }
  },

  retrieve: function(){
    App.cotracts.Manufacturer.deployed().then().catch(function(err){
      console.log(err);
    });
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


