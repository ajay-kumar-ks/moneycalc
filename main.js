var arrEle = [];
var arrEleTemp = [];
var searchQuery = "";
let arrsomeMainData = {};


$(document).ready(function () {
  greeting();
  setUpMenuForUis('home');
  // Load existing data from localStorage
  if (localStorage.getItem("moneyCalcData")) {
    arrEle = JSON.parse(localStorage.getItem("moneyCalcData"));
    setAppTheam();
    showContent();
    SetSubTotalAmount();
  }

  $("#addval").on("click", function () {
    var content = $("#contentbox").val();
    var amount = $("#contentamount").val();
    var id = arrEle.length;

    if (content.trim() != "") {
      if (amount != 0 && amount != "") {
        let val = {
          id: id,
          name: content.trim(),
          amount: parseInt(amount, 10),
          qty: 1,
          totalamt: parseInt(amount, 10),
          checked: 1,
        };
        arrEle.push(val);
        updateLocalStorage(); 
        searchQuery = "";
        showContent();
        SetSubTotalAmount();
        $("#contentbox").val("");
        $("#contentamount").val("");
      } else {
        $("#contentamount").css("border-color", "red");
        setTimeout(() => {
          $("#contentamount").css("border-color", "");
        }, 5000);
      }
    } else {
      $("#contentbox").css("border-color", "red");
      setTimeout(() => {
        $("#contentbox").css("border-color", "");
      }, 5000);
    }
  });

  // Event delegation for dynamically added elements
  $(document).on("click", ".deleteElement", function () {
    var idval = $(this).attr("data-id");
    arrEleTemp = arrEle;
    arrEle = arrEle.filter((item) => item.id != idval);
    updateLocalStorage(); // Save changes to localStorage
    showContent();
    SetSubTotalAmount();
  });

  $(document).on("click", ".plusminus", function () {
    var idval = $(this).attr("data-id");
    var type = $(this).attr("data-val");
    var $qtyInput = $(this).parent().find(".itemqty");
    var currentQty = parseInt($qtyInput.val(), 10) || 0;
    var $totAmt = $(this).parent().find(".totalAmount");
    var currentTotalAmt = parseInt($totAmt.val(), 10) || 0;
    var currentAmount = parseInt($totAmt.attr("data-amount"), 10) || 0;

    if (type == "minus" && currentQty > 1) {
      currentQty--;
      currentTotalAmt -= currentAmount;
    } else if (type == "plus") {
      currentQty++;
      currentTotalAmt += currentAmount;
    }

    // Update array and content
    $.each(arrEle, function (index, value) {
      if (value.id == idval) {
        arrEleTemp = arrEle;
        value.qty = currentQty;
        value.totalamt = currentTotalAmt;
        return false; // Exit loop
      }
    });
    updateLocalStorage(); // Save changes to localStorage
    showContent();
    SetSubTotalAmount();
  });

  $(document).on("keyup", ".inputAmount", function () {
    var newamount = $(this).val();
    var idval = $(this).attr("data-id");
    var $totAmt = $(this).parent().parent().find(".totalAmount");

    $.each(arrEle, function (index, value) {
      if (value.id == idval) {
        arrEleTemp = arrEle;
        value.amount = parseInt(newamount, 10) || 0;
        value.totalamt = value.amount * value.qty;
        $totAmt.val(value.totalamt);
        return false;
      }
    });
    updateLocalStorage();
    SetSubTotalAmount();
  });

  function SetSubTotalAmount() {
    var SubTotal = arrEle.reduce(function (sum, value) {
      return value.checked == 1 ? sum + parseInt(value.totalamt, 10) : sum;
    }, 0);

    $("#subTotalAmountLabel").text("SubTotal: " + SubTotal);
  }

  function updateLocalStorage() {
    localStorage.setItem("moneyCalcData", JSON.stringify(arrEle));
  }


  function showContent() {
    var htmlContent = "";
    arrEle.sort((a, b) => {
      if (a.checked !== b.checked) {
          return b.checked - a.checked; 
      }
      return b.id - a.id;
    });
  
    $.each(arrEle, function (index, val) {
      var regex = new RegExp(searchQuery.replace(/%/g, ".*"), "i");
      if (regex.test(val.name) || searchQuery === "") {
        htmlContent += `<div class="bodycard bodycard-darkMode" >
                    <div style="flex: 1; text-align:center; display:flex; justify-content:center; align-items:center;">
                        <div class="checkbox-wrapper-18">
                            <div class="round">
                                <input type="checkbox" id="checkbox-${
                                  val.id
                                }" ${
          val.checked == 1 ? "checked" : ""
        } class="itemSelected" data-id="${val.id}" />
                                <label for="checkbox-${val.id}"></label>
                            </div>
                        </div>
                        <h3 style="color:#eee">${val.name}</h3>
                    </div>
                    <div class="ui input" style="flex: 1; min-width: 100px;">
                        <input data-id="${
                          val.id
                        }" type="number" class="inputAmount inputBoxes-darkMode" placeholder="AMT" value="${
          val.amount
        }" style="font-size:16px;height:40px;">
                        <button class="ui icon red button deleteElement" data-id="${
                          val.id
                        }" style="height:40px;width:40px;font-size:16px;">
                            <i class="trash icon"></i>
                        </button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button class="ui icon button plusminus plusMinusBtn-darkMode" data-id="${
                          val.id
                        }" data-val="minus" style="height:40px;width:40px;font-size:16px;">
                            <i class="minus icon"></i>
                        </button>
                        <div class="ui input" style="width: 70px;">
                            <input type="number" readonly placeholder="Qty" class="itemqty inputBoxes-darkMode" value="${
                              val.qty
                            }" style="font-size:16px;height:40px;text-align:center;">
                        </div>
                        <button class="ui icon button plusminus plusMinusBtn-darkMode" data-id="${
                          val.id
                        }" data-val="plus" style="height:40px;width:40px;font-size:16px;">
                            <i class="plus icon"></i>
                        </button>
                        <div class="ui input" style="flex: 1; min-width: 100px;">
                            <input type="number" readonly class="totalAmount inputBoxes-darkMode" data-amount="${
                              val.amount
                            }" placeholder="Total" value="${
          val.totalamt
        }" style="font-size:16px;height:40px;">
                        </div>
                    </div>
                </div>`;
      }
    });
    $(".bodycon").html(htmlContent);
    setAppTheam();
  }
  $(document).on("change", ".itemSelected", function () {
    var idval = $(this).attr("data-id");
    var check = 0;
    if ($(this).prop("checked")) {
      check = 1;
    }
    $.each(arrEle, function (index, value) {
      if (value.id == idval) {
        value.checked = check;
        return false;
      }
    });
    updateLocalStorage();
    SetSubTotalAmount();
  });
  function unCheckAllCheckBox() {
    if (arrEle.length > 0) {
        arrEleTemp = arrEle;
      $(".itemSelected").each(function (index, element) {
        $(element).prop("checked", false);
      });
      $.each(arrEle, function (index, value) {
        value.checked = 0;
      });
      updateLocalStorage();
      SetSubTotalAmount();
      showContent();
    }
  }
  function checkAllCheckBox() {
    if (arrEle.length > 0) {
        arrEleTemp = arrEle;
      $(".itemSelected").each(function (index, element) {
        $(element).prop("checked", true);
      });
      $.each(arrEle, function (index, value) {
        value.checked = 1;
      });
      updateLocalStorage();
      SetSubTotalAmount();
      showContent();
    }
  }

  $("#menuIcon").on("click", function () {
    $("#menuModal").modal("show");
  });

  $("#closeMenu").on("click", function () {
    $("#menuModal").modal("hide");
  });

  $("#selectAll").on("click", function () {
    checkAllCheckBox();
    $("#menuModal").modal("hide");
  });
  $("#unselectAll").on("click", function () {
    unCheckAllCheckBox();
    $("#menuModal").modal("hide");
  });

  $("#clearAll").on("click", function () {
    arrEleTemp = arrEle;
    arrEle = [];
    updateLocalStorage();
    SetSubTotalAmount();
    showContent();
    $("#menuModal").modal("hide");
  });

  $("#settings").on("click", function () {
    alert("Wow ,Settings clicked!");
    $("#menuModal").modal("hide");
  });
  $("#contentbox").on("keyup", function () {
    var query = $(this).val();
    searchQuery = query;
    showContent();
  });

  $("#undoFundManager").on("click", function () {
    if(arrEleTemp.length > 0){
        arrEle = arrEleTemp;
        updateLocalStorage();
        SetSubTotalAmount();
        showContent();
        $("#menuModal").modal("hide");
    }
  });
  $("#qtyToOne").on("click", function () {
    if (arrEle.length > 0) {
      arrEleTemp = arrEle;
    $.each(arrEle, function (index, value) {
      value.qty = 1;
      value.totalamt = value.amount;
    });
    updateLocalStorage();
    SetSubTotalAmount();
    showContent();
    $('#menuModal').modal('hide')
  }
});

$('#darkMode').on('click',function(){
  funSwitchToDarkMode();
  $('#menuModal').modal('hide')
});
$('#lightMode').on('click',function(){
  funSwitchToLightMode();
  $('#menuModal').modal('hide')
  });
});

function greeting() {
  $("#greeting").html("Hellooo " + getGreeting());
}

function getGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

$(".homeMenuContent").on("click", function () {
  var conType = $(this).attr("data-val");
  if (conType == "fundCalculator") {
    $("#fundCalculator").css("display", "");
    $(".homeContainer").css("display", "none");
    setUpMenuForUis('fundCalculator');
  }else if(conType == "Reports"){
    $('.ui.bottom.modal').modal('show');
  }
});

$("#homeIcon").on("click", function () {
    $("#fundCalculator").css("display", "none");
    $(".homeContainer").css("display", "");
    setUpMenuForUis('home');
});

function setUpMenuForUis(currentUi){
    if(currentUi == 'home'){
      $('.fundCalcMenus').css('display','none')
      $('.homeMenus').css('display','flex')
    }else if(currentUi == 'fundCalculator'){
        $('.fundCalcMenus').css('display','flex')
        $('.homeMenus').css('display','none')
    }
}

function funSwitchToDarkMode(){
  $('body').addClass('darkMode-body');
  $('.top-nav').addClass('darkMode-headNav');
  $('.appBody').addClass('darkMode-appBody');
  $('.homeMenuContent,.bottom-nav').addClass('darkMode-text1');
  $('.homeMenuContent').addClass('darkMode-homeMenu');
  $('.bottom-nav').addClass('darkMode-borromNav');
  $('.greetingtxt').addClass('darkMode-text2');
  $('.subHeadingTxt').addClass('darkMode-text3');
  $('.bodycard').addClass('bodycard-darkMode');
  
  $('input').addClass('inputBoxes-darkMode');
  $('.plusminus').addClass('plusMinusBtn-darkMode');

  $('.menuHeader').addClass('menuHed-darkMode');
  $('.menuContent').addClass('menuCon-darkmode');

  updateLocalStorageMainDatas('appTheme','dark');
}
function funSwitchToLightMode(){
  $('body').removeClass('darkMode-body');
  $('.top-nav').removeClass('darkMode-headNav');
  $('.appBody').removeClass('darkMode-appBody');
  $('.homeMenuContent,.bottom-nav').removeClass('darkMode-text1');
  $('.bottom-nav').removeClass('darkMode-borromNav');
  $('.homeMenuContent').removeClass('darkMode-homeMenu');
  $('.greetingtxt').removeClass('darkMode-text2');
  $('.subHeadingTxt').removeClass('darkMode-text3');
  $('.bodycard').removeClass('bodycard-darkMode');
  
  $('input').removeClass('inputBoxes-darkMode');
  $('.plusminus').removeClass('plusMinusBtn-darkMode');

  $('.menuHeader').removeClass('menuHed-darkMode');
  $('.menuContent').removeClass('menuCon-darkmode');

  updateLocalStorageMainDatas('appTheme','light');
}

function updateLocalStorageMainDatas(type, datas) {
  let updatedData = JSON.parse(localStorage.getItem("someMainDatas"));

  if (!updatedData || typeof updatedData !== 'object' || Array.isArray(updatedData)) {
      updatedData = {};  
  }

  updatedData[type] = datas;
  localStorage.setItem("someMainDatas", JSON.stringify(updatedData));
}

function setAppTheam(){
  arrsomeMainData = JSON.parse(localStorage.getItem("someMainDatas")) || {};

  if (!localStorage.getItem("someMainDatas")) {
      updateLocalStorageMainDatas('appTheme', 'dark');
      funSwitchToDarkMode();
  } else {
      if (arrsomeMainData.appTheme === 'dark') {
          funSwitchToDarkMode();
      } else {
          funSwitchToLightMode();
      }
  }
}

$('#SaveData').on('click', function() {
  if (arrEle.length > 0) {
    let saveAllItems = [];
    if (localStorage.getItem("savedFundsData") && localStorage.getItem("savedFundsData") != '') {
      saveAllItems = JSON.parse(localStorage.getItem("savedFundsData"));
    }
    let AdditionalDatas = {};
    let TotAmount = 0;
    arrEle.forEach(element => {
      TotAmount += Number(element.totalamt);
    });
    AdditionalDatas['array'] = arrEle;
    AdditionalDatas['saveDate'] = new Date().toLocaleString(); // Save date as readable string
    AdditionalDatas['totitems'] = arrEle.length;
    AdditionalDatas['totAmt'] = TotAmount;
    saveAllItems.push(AdditionalDatas); // Corrected this line
    localStorage.setItem("savedFundsData", JSON.stringify(saveAllItems));
    $('#menuModal').modal('hide');
  }
});


$('.reportsDatas').on('click',function(){
  var reportType = $(this).attr('data-val');
  if(reportType == 'fundManagerReports'){
    loadFundManagerReports();
  }
});
function loadFundManagerReports(){
  if (localStorage.getItem("savedFundsData")){
    savedAllItems = JSON.parse(localStorage.getItem("savedFundsData"));
    if(savedAllItems){
      htmlCon = '';
      $.each(savedAllItems, function (svIndex, svValue) { 
         htmlCon += `<div class="fundShowCard" data-id="${svIndex}">
                   <p style="font-size:1.2rem;color:#7886C7;">${svValue.saveDate}</p>
                   <div style="display:flex;justify-content:space-between;">
                       <p style="font-size:1.2rem;">Total Items : ${svValue.totitems}</p>
                       <p style="font-size:1.2rem;">Total Amount : <b>&#x20B9;&nbsp;${svValue.totAmt}</b></p>
                   </div> 
                </div>`;
      });
      $('.fundMngFunds').html(htmlCon);
    }
  }
  $('#ReportsModalModal').modal('show');
}
$('#closeReportsModal1').on('click',function(){
  $('#ReportsModalModal').modal('hide');
});

$(document).on('click','.fundShowCard',function(){
    $('.fundMngFunds').css('display','none');
    $('.fundmanagerReportContainer').css('display','');
    var id = $(this).attr('data-id');
    if (localStorage.getItem("savedFundsData")){
      savedAllItems = JSON.parse(localStorage.getItem("savedFundsData"));
      if(savedAllItems){
        tr = '';
        var allTotalSum = 0;
        $.each(savedAllItems, function (svIndex, svValue) { 
            if(svIndex == id){
              if(svValue.array.length > 0){
                $.each(svValue.array, function (tbIndx, tbVal) { 
                   tr += `<tr>
                            <td>${tbVal.name}</td>
                            <td>${tbVal.qty}</td>
                            <td>${tbVal.amount}</td>
                            <td>${tbVal.totalamt}</td>
                        </tr>`;
                        allTotalSum += Number(tbVal.totalamt);
                });
              }
            }
        });
        $('.totalSumAmountTable').html('&#x20B9;&nbsp;'+allTotalSum);
        $('.fundManagerReportTable tbody').html(tr);
      }
    }
});

$('.backIcon').on('click',function(){
  $('.fundMngFunds').css('display','');
  $('.fundmanagerReportContainer').css('display','none');
  $('.frontIcon').css('color','');
});
$('.frontIcon').on('click',function(){
  if($('.fundManagerReportTable tbody').html().trim() != '' && $('.fundManagerReportTable tbody').html().trim() != null){
    $('.fundMngFunds').css('display','none');
    $('.fundmanagerReportContainer').css('display','');
  }
});
$(document).ready(function () {
  if($('.fundManagerReportTable tbody').html().trim() == ''){
    $('.frontIcon').css('color','gray');
  }
});

