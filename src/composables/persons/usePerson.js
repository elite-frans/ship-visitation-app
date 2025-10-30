export function usePerson() {
  const personCols = [
    {
      field: "first_name",
      header: "First Name",
    },
    {
      field: "last_name",
      header: "Last Name",
    },
    {
      field: "company",
      header: "Company",
    },
    {
      field: "rank",
      header: "Rank",
    },
  ];

  return { personCols };
}
