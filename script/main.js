/* Variables */
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

  var listItem = document.createElement("li");
  listItem.textContent = newInput.value;
  rankingList.insertBefore(listItem, rankingList.childNodes[minRank]);

  newInput.value = "";
  addRankBtn.disabled = true;
  minRank = 0;
  maxRank = ranking.length + 1;
};

var updateUI = function() {
  if (newInput.value === "") {
    addRankBtn.disabled = true;
    hideRankingChoice();
  }
  else {
    if (rankingComplete()) {
      addRankBtn.disabled = false;
      hideRankingChoice();
    }
    else {
      showRankingChoice();
    }
  }
};

/* Event listeners */
updateUI();
newInput.addEventListener("input", function() {
  updateUI();
});

addRankBtn.addEventListener("click", function() {
  addToRanking();
});

chooseLeftBtn.addEventListener("click", function() {
  maxRank = getComparisonIndex() + 1;
  updateUI();
});


chooseRightBtn.addEventListener("click", function() {
  minRank = getComparisonIndex() + 1;
  updateUI();
});
