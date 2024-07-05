function handleError(error, res) {
  console.error("Error:", error);
  res
    .status(500)
    .json({
      error: "Sorry, there was an error retrieving your data. Please try again",
    });
}

module.exports = handleError;
