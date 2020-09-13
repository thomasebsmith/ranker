/* Variables */
var loadRankingInput = document.querySelector(".ranking-input");
var loadRankingBtn = document.querySelector(".ranking-load-btn");
var saveRankingOutput = document.querySelector(".ranking-output");
var saveRankingBtn = document.querySelector(".ranking-save-btn");
var newInput = document.querySelector("#new-input");
var comparisonSection = document.querySelector(".comparison");
var chooseLeftBtn = document.querySelector(".comparison > input.left");
var chooseRightBtn = document.querySelector(".comparison > input.right");
var addRankBtn = document.querySelector(".rank-btn");
var rankingList = document.querySelector(".list");

// An array containing all ranked items in order. Item 0 is the highest ranked.
var ranking = [];

// The (inclusive) lower bound on the current item's index in `ranking`.
var minRank = 0;

// The (exclusive) upper bound on the current item's index in `ranking`.
var maxRank = 1;

/* Functions */
var addRankingListItemElement = function(text, index) {
  var listItem = document.createElement("li");
  listItem.textContent = text;

  var insertBefore;
  if (index >= rankingList.children.length) {
    insertBefore = null;
  }
  else {
    insertBefore = rankingList.children[index];
  }
  rankingList.insertBefore(listItem, insertBefore);
};

var loadRanking = function() {
  var rankingString = loadRankingInput.value;
  var confirmMessage = "Are you sure you want to load a new ranking?" +
    " This will overwrite the existing one.";
  if (ranking.length !== 0 && !confirm(confirmMessage)) {
    return;
  }

  var json = null;
  var isError = false;
  try {
    json = JSON.parse(rankingString);
    json = json.map(element => element + "");
  }
  catch (err) {
    isError = true;
  }

  if (isError || !Array.isArray(json)) {
    throw new SyntaxError("Invalid ranking string provided");
  }

  ranking = json;

  minRank = 0;
  maxRank = ranking.length + 1;

  for (var i = 0; i < ranking.length; ++i) {
    addRankingListItemElement(ranking[i], i);
  }

  loadRankingInput.value = "";
};

var saveRanking = function() {
  return JSON.stringify(ranking);
};

var updateRankingSaveBox = function() {
  saveRankingOutput.value = saveRanking();
};


var getComparisonIndex = function() {
  return minRank + Math.floor((maxRank - minRank) / 2 - 1);
};

var rankingComplete = function() {
  return ranking.length === 0 || minRank === maxRank - 1;
};

var showRankingChoice = function() {
  comparisonSection.classList.remove("hidden");

  var leftName = newInput.value;
  var rightName = ranking[getComparisonIndex()];

  chooseLeftBtn.value = leftName + " should be ranked higher";
  chooseRightBtn.value = rightName + " should be ranked higher";
};

var hideRankingChoice = function() {
  comparisonSection.classList.add("hidden");
};

var addToRanking = function() {
  if (minRank !== maxRank - 1) {
    throw new RangeError(
      "Invalid attempt to rank: the rank was not fully specified"
    );
  }

  if (minRank < 0 || maxRank > ranking.length + 1) {
    throw new RangeError(
      "Invalid attempt to rank: minRank/maxRank were out of bounds"
    );
  }

  ranking.splice(minRank, 0, newInput.value);
  addRankingListItemElement(newInput.value, minRank);

  updateRankingSaveBox();

  newInput.value = "";
  minRank = 0;
  maxRank = ranking.length + 1;
};

var updateUI = function() {
  if (newInput.value === "") {
    addRankBtn.disabled = true;
    hideRankingChoice();
  }
  else {
    var canAddRank = rankingComplete();
    if (canAddRank && ranking.length === 0) {
      addRankBtn.disabled = false;
      hideRankingChoice();
    }
    else if (canAddRank) {
      addToRanking();
      addRankBtn.disabled = true;
      hideRankingChoice();
    }
    else {
      showRankingChoice();
    }
  }
};

/* Event listeners */
loadRankingBtn.addEventListener("click", function() {
  loadRanking();
  updateRankingSaveBox();
  updateUI();
});

saveRankingBtn.addEventListener("click", function() {
  saveRankingOutput.select();
  document.execCommand("copy");
});

newInput.addEventListener("input", function() {
  updateUI();
});

addRankBtn.addEventListener("click", function() {
  addToRanking();
  updateUI();
});

chooseLeftBtn.addEventListener("click", function() {
  maxRank = getComparisonIndex() + 1;
  updateUI();
});

chooseRightBtn.addEventListener("click", function() {
  minRank = getComparisonIndex() + 1;
  updateUI();
});

/* Main program */
updateRankingSaveBox();
updateUI();
