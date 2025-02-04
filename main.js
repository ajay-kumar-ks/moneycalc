var arrEle = [];
var arrEleTemp = [];
var searchQuery = "";

$(document).ready(function () {
  greeting();
  setUpMenuForUis('home');
  // Load existing data from localStorage
  if (localStorage.getItem("moneyCalcData")) {
    arrEle = JSON.parse(localStorage.getItem("moneyCalcData"));
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
        updateLocalStorage(); // Save changes to localStorage
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
    $.each(arrEle, function (index, val) {
      var regex = new RegExp(searchQuery.replace(/%/g, ".*"), "i");
      if (regex.test(val.name) || searchQuery === "") {
        htmlContent += `<div class="bodycard bodycard-darkMode" style="background-color:#27445D;">
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
                        <h3>${val.name}</h3>
                    </div>
                    <div class="ui input" style="flex: 1; min-width: 100px;">
                        <input data-id="${
                          val.id
                        }" type="number" class="inputAmount" placeholder="AMT" value="${
          val.amount
        }" style="font-size:16px;height:40px;background-color: #393E46;color:#eee;">
                        <button class="ui icon red button deleteElement" data-id="${
                          val.id
                        }" style="height:40px;width:40px;font-size:16px;">
                            <i class="trash icon"></i>
                        </button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button class="ui icon button plusminus" data-id="${
                          val.id
                        }" data-val="minus" style="height:40px;width:40px;font-size:16px;background-color:rgb(38, 45, 56);color:#eee;">
                            <i class="minus icon"></i>
                        </button>
                        <div class="ui input" style="width: 70px;">
                            <input type="number" readonly placeholder="Qty" class="itemqty" value="${
                              val.qty
                            }" style="font-size:16px;height:40px;text-align:center;background-color: #393E46;color:#eee;">
                        </div>
                        <button class="ui icon button plusminus" data-id="${
                          val.id
                        }" data-val="plus" style="height:40px;width:40px;font-size:16px;background-color: rgb(38, 45, 56);color:#eee;">
                            <i class="plus icon"></i>
                        </button>
                        <div class="ui input" style="flex: 1; min-width: 100px;">
                            <input type="number" readonly class="totalAmount" data-amount="${
                              val.amount
                            }" placeholder="Total" value="${
          val.totalamt
        }" style="font-size:16px;height:40px;background-color: #393E46;color:#eee;">
                        </div>
                    </div>
                </div>`;
      }
    });
    $(".bodycon").html(htmlContent);
  }
  $(document).on("change", ".itemSelected", function () {
    var idval = $(this).attr("data-id");
    console.log("hhh", idval);
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
