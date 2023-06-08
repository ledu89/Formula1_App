export const searchDrivers = (drivers, searchTerm) => {
  const searchValue = searchTerm.toLowerCase();
  return drivers.filter(
    (driver) =>
      driver.Driver.givenName.toLowerCase().includes(searchValue) ||
      driver.Driver.familyName.toLowerCase().includes(searchValue) ||
      driver.Constructors[0].name.toLowerCase().includes(searchValue)
  );
};

export const searchTeams = (teams, searchTerm) => {
  const searchValue = searchTerm.toLowerCase();
  return teams.filter((team) =>
    team.Constructor.name.toLowerCase().includes(searchValue)
  );
};

export const searchRaces = (allRaces, searchTerm) => {
  const searchValue = searchTerm.toLowerCase();
  return allRaces.filter(
    (race) =>
      race.raceName.toLowerCase().includes(searchValue) ||
      race.Circuit.circuitName.toLowerCase().includes(searchValue)
  );
};
