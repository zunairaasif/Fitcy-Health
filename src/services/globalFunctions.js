export const getErrorDetailsforNotif = (response) => {
  if (response && response.detail) {
    return response.detail;
  } else if (response) {
    const breakdown = Object.entries(response);
    let stringtoreturn = "";

    breakdown.forEach((entry) => {
      stringtoreturn += entry[0] + ": " + entry[1];
      stringtoreturn += "\n\n";
    });

    return stringtoreturn;
  } else return null;
};

export const getGreetingTime = (m) => {
  var g = null; //return g

  if (!m || !m.isValid()) {
    return;
  } //if we can't find a valid or filled moment, we return.

  var split_afternoon = 12; //24hr time to split the afternoon
  var split_evening = 17; //24hr time to split the evening
  var currentHour = parseFloat(m.format("HH"));

  if (currentHour >= split_afternoon && currentHour <= split_evening) {
    g = "Afternoon";
  } else if (currentHour >= split_evening) {
    g = "Evening";
  } else {
    g = "Morning";
  }

  return g;
};
